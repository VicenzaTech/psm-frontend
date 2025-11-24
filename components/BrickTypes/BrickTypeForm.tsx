// components/BrickTypes/BrickTypeForm.tsx
import React, { useState, useEffect } from 'react';
import { BrickType } from '../../types';
import { Button } from '../Common/Button';

interface BrickTypeFormProps {
  brickType: BrickType | null;
  workshops: Array<{ id: number; name: string }>;
  productionLines: Array<{ id: number; name: string; workshop_id: number }>;
  onSave: (brickType: BrickType) => void;
  onCancel: () => void;
}

export const BrickTypeForm: React.FC<BrickTypeFormProps> = ({
  brickType,
  workshops,
  productionLines,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<BrickType>({
    id: 0,
    name: '',
    size: '',
    type: 'porcelain',
    workshop_id: 0,
    production_line_id: 0,
    chu_ky_khoan: 0,
    san_luong_ra_lo_per_day: 0,
    san_luong_chinh_pham_per_day: 0,
    so_ngay_tru_khoan: 0,
    san_luong_khoan_30_ngay: 0,
    san_luong_khoan_31_ngay: 0,
    cong_khoan_giam_chu_ky: 0,
    giam_khoan_tang_chu_ky: 0,
    loai_mai: 'mai_nong',
    thoi_gian_cho_mai_nguoi_hours: 0,
    ty_le_A1_khoan: 0,
    ty_le_A2_khoan: 0,
    ty_le_cat_lo_khoan: 0,
    ty_le_phe_1_khoan: 0,
    ty_le_phe_2_khoan: 0,
    ty_le_phe_huy_khoan: 0,
    don_gia_thuong_A1: 0,
    don_gia_thuong_A2: 0,
    don_gia_thuong_cat_lo: 0,
    don_gia_phat_san_luong: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  const [filteredProductionLines, setFilteredProductionLines] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    if (brickType) {
      setFormData(brickType);
    }
  }, [brickType]);

  useEffect(() => {
    if (formData.workshop_id) {
      const filtered = productionLines.filter(
        line => line.workshop_id === formData.workshop_id
      );
      setFilteredProductionLines(filtered);
    }
  }, [formData.workshop_id, productionLines]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: brickType?.id || Date.now(),
      created_at: brickType?.created_at || new Date(),
      updated_at: new Date()
    });
  };

  return (
    <form className="brick-type-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="workshop_id">Phân xưởng</label>
          <select
            id="workshop_id"
            name="workshop_id"
            value={formData.workshop_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn phân xưởng</option>
            {workshops.map(workshop => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="production_line_id">Dây chuyền</label>
          <select
            id="production_line_id"
            name="production_line_id"
            value={formData.production_line_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn dây chuyền</option>
            {filteredProductionLines.map(line => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Tên dòng gạch</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="size">Kích thước</label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Loại gạch</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="porcelain">Porcelain</option>
            <option value="granite">Granite</option>
            <option value="ceramic">Ceramic</option>
            <option value="semi_porcelain">Semi Porcelain</option>
            <option value="kimsa">Kimsa</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="loai_mai">Loại mài</label>
          <select
            id="loai_mai"
            name="loai_mai"
            value={formData.loai_mai}
            onChange={handleChange}
          >
            <option value="mai_nong">Mài nóng</option>
            <option value="mai_nguoi">Mài nguội</option>
            <option value="khong_mai">Không mài</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="chu_ky_khoan">Chu kỳ khoán (phút)</label>
          <input
            type="number"
            id="chu_ky_khoan"
            name="chu_ky_khoan"
            value={formData.chu_ky_khoan}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="san_luong_ra_lo_per_day">Sản lượng ra lò/ngày (m²)</label>
          <input
            type="number"
            id="san_luong_ra_lo_per_day"
            name="san_luong_ra_lo_per_day"
            value={formData.san_luong_ra_lo_per_day}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="san_luong_chinh_pham_per_day">Sản lượng chính phẩm/ngày (m²)</label>
          <input
            type="number"
            id="san_luong_chinh_pham_per_day"
            name="san_luong_chinh_pham_per_day"
            value={formData.san_luong_chinh_pham_per_day}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="so_ngay_tru_khoan">Số ngày trừ khoán</label>
          <input
            type="number"
            id="so_ngay_tru_khoan"
            name="so_ngay_tru_khoan"
            value={formData.so_ngay_tru_khoan}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="san_luong_khoan_30_ngay">Sản lượng khoán 30 ngày (m²)</label>
          <input
            type="number"
            id="san_luong_khoan_30_ngay"
            name="san_luong_khoan_30_ngay"
            value={formData.san_luong_khoan_30_ngay}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="san_luong_khoan_31_ngay">Sản lượng khoán 31 ngày (m²)</label>
          <input
            type="number"
            id="san_luong_khoan_31_ngay"
            name="san_luong_khoan_31_ngay"
            value={formData.san_luong_khoan_31_ngay}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cong_khoan_giam_chu_ky">Cộng khoán khi giảm chu kỳ (m²/ngày)</label>
          <input
            type="number"
            id="cong_khoan_giam_chu_ky"
            name="cong_khoan_giam_chu_ky"
            value={formData.cong_khoan_giam_chu_ky}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="giam_khoan_tang_chu_ky">Giảm khoán khi tăng chu kỳ (m²/ngày)</label>
          <input
            type="number"
            id="giam_khoan_tang_chu_ky"
            name="giam_khoan_tang_chu_ky"
            value={formData.giam_khoan_tang_chu_ky}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" className="btn-primary">
          Lưu
        </Button>
        <Button type="button" className="btn-secondary" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
};