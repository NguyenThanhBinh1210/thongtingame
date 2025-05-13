import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  level: z.number()
    .min(1, 'Cấp độ phải lớn hơn hoặc bằng 1')
    .max(5, 'Cấp độ tối đa là 5'),
  parentId: z.string().optional()
}).refine((data) => {
  // Nếu level > 1 thì parentId là bắt buộc
  if (data.level > 1 && !data.parentId) {
    return false;
  }
  return true;
}, {
  message: 'Danh mục cha là bắt buộc với cấp độ > 1',
  path: ['parentId'] // Chỉ định lỗi cho trường parentId
});

export type CategorySchema = z.infer<typeof categorySchema>; 