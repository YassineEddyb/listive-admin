# Product & Image Management

> View and manage products and generated images across all users.

## Products Page (`/admin/products`)

- Data table with all user products
- Columns: thumbnail, title, user, image count, status, creation date
- Search by product name or user
- CSV export

## Product Detail (`/admin/products/[id]`)

- Full product information
- Image gallery of all generated images
- Edit history (from `image_edit_operations` if available — silently returns empty if table doesn't exist)
- Actions: toggle visibility, delete product

## Images Page (`/admin/images`)

- Gallery view of all generated images across all users
- Filterable by status, style, user
- Image metadata: style, angle, aspect ratio, generation status

## Implementation

| File | Purpose |
|------|---------|
| `src/features/products/controllers/get-products.ts` | Fetch all products |
| `src/features/products/controllers/get-edit-history.ts` | Fetch edit history (graceful fallback) |
| `src/features/products/components/product-table.tsx` | Product data table |
| `src/features/products/components/product-actions.tsx` | Action buttons |
| `src/features/products/actions/product-actions.ts` | Product mutation actions |
| `src/features/images/controllers/get-images.ts` | Fetch all images |
| `src/features/images/components/image-gallery.tsx` | Image gallery view |
| `src/features/images/actions/image-actions.ts` | Image mutation actions |
