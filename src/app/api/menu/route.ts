import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category, Product, MediaItem } from '@/types/menu';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const menuPath = path.join(process.cwd(), 'public', 'menu');
    
    if (!fs.existsSync(menuPath)) {
      return NextResponse.json({ categories: [] });
    }

    // Read category directories
    const categoriesDirs = fs.readdirSync(menuPath).filter(file => {
      const fullPath = path.join(menuPath, file);
      return fs.statSync(fullPath).isDirectory() && !file.startsWith('.') && !file.startsWith('_');
    });

    const categories: Category[] = [];

    for (const catDir of categoriesDirs) {
      const catPath = path.join(menuPath, catDir);
      
      // Load category metadata if available
      let categoryMeta = {
        name: {
          ar: catDir.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          tr: catDir.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          en: catDir.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        },
        order: 100
      };

      const metaPath = path.join(catPath, '_category.json');
      if (fs.existsSync(metaPath)) {
        try {
          const content = fs.readFileSync(metaPath, 'utf8');
          categoryMeta = { ...categoryMeta, ...JSON.parse(content) };
        } catch (e) {
          console.error(`Error parsing _category.json in ${catDir}:`, e);
        }
      }

      // Check for category cover image (support webp, avif, jpg, jpeg, png)
      let coverImage: string | null = null;
      const categoryFiles = fs.readdirSync(catPath);
      const coverFile = categoryFiles.find(f => /^cover\.(webp|avif|jpg|jpeg|png)$/i.test(f));
      if (coverFile) {
        coverImage = `/menu/${catDir}/${coverFile}`;
      }

      // Read product folders
      const productDirs = fs.readdirSync(catPath).filter(file => {
        const fullPath = path.join(catPath, file);
        return fs.statSync(fullPath).isDirectory() && !file.startsWith('.') && !file.startsWith('_');
      });

      const products: Product[] = [];

      for (const prodDir of productDirs) {
        const prodPath = path.join(catPath, prodDir);
        const infoPath = path.join(prodPath, 'info.json');

        if (fs.existsSync(infoPath)) {
          try {
            const content = fs.readFileSync(infoPath, 'utf8');
            const info = JSON.parse(content);
            
            const prodFiles = fs.readdirSync(prodPath);
            const mediaList: MediaItem[] = [];

            // 1. Scan for optional video.mp4
            const videoFile = prodFiles.find(f => f.toLowerCase() === 'video.mp4');
            if (videoFile) {
              mediaList.push({
                type: 'video',
                url: `/menu/${catDir}/${prodDir}/${videoFile}`
              });
            }

            // 2. Scan and sort images (e.g. image.webp, image2.png, image3.jpg)
            const imgRegex = /^image(\d*)\.(webp|avif|jpg|jpeg|png)$/i;
            const imagesFound: { index: number; filename: string }[] = [];

            for (const file of prodFiles) {
              const match = file.match(imgRegex);
              if (match) {
                const indexStr = match[1];
                const index = indexStr ? parseInt(indexStr, 10) : 1;
                imagesFound.push({ index, filename: file });
              }
            }

            // Sort images by index (e.g. image/image1 first, then image2, etc.)
            imagesFound.sort((a, b) => a.index - b.index);

            for (const img of imagesFound) {
              mediaList.push({
                type: 'image',
                url: `/menu/${catDir}/${prodDir}/${img.filename}`
              });
            }

            // Fallback placeholder if no images or videos are present
            if (mediaList.length === 0) {
              mediaList.push({
                type: 'image',
                url: `/placeholder-food.jpg`
              });
            }

            products.push({
              id: prodDir,
              name: info.name || { ar: prodDir, tr: prodDir, en: prodDir },
              description: info.description, // Optional
              price: typeof info.price === 'number' || info.price === null ? info.price : parseFloat(info.price),
              oldPrice: typeof info.oldPrice === 'number' ? info.oldPrice : (info.oldPrice ? parseFloat(info.oldPrice) : undefined),
              currency: info.currency || 'TL',
              available: typeof info.available === 'boolean' ? info.available : true,
              featured: !!info.featured,
              bestSeller: !!info.bestSeller,
              new: !!info.new,
              spicyLevel: typeof info.spicyLevel === 'number' ? info.spicyLevel : 0,
              tags: Array.isArray(info.tags) ? info.tags : [],
              order: typeof info.order === 'number' ? info.order : 9999,
              media: mediaList
            });
          } catch (e) {
            console.error(`Error parsing info.json in ${catDir}/${prodDir}:`, e);
          }
        }
      }

      // Sort products:
      // 1. Featured products first
      // 2. Sorted by manual "order" ascending
      // 3. Alphabetically by product name in English/fallback ID
      products.sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        const orderA = a.order ?? 9999;
        const orderB = b.order ?? 9999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        const nameA = a.name.en || a.id;
        const nameB = b.name.en || b.id;
        return nameA.localeCompare(nameB);
      });

      categories.push({
        id: catDir,
        name: categoryMeta.name,
        order: typeof categoryMeta.order === 'number' ? categoryMeta.order : 100,
        coverImage,
        products
      });
    }

    // Sort categories: by order first, then alphabetically
    categories.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.id.localeCompare(b.id);
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching menu structure:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
