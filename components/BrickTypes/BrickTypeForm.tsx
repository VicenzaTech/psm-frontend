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
    code: '',
    name: '',
    size: '',
    size_x: 0,
    size_y: 0,
    type: 'porcelain',
    workshopId: 1,
    productionLineId: 1,
    workshopName: '',
    productionLineName: '',
    chuKyKhoan: 0,
    sanLuongRaLoPerDay: 0,
    sanLuongChinhPhamPerDay: 0,
    soNgayTruKhoan: 0,
    sanLuongKhoan30Ngay: 0,
    sanLuongKhoan31Ngay: 0,
    congKhoanGiamChuKy: 0,
    giamKhoanTangChuKy: 0,
    loaiMai: 'mai_nong',
    thoiGianChoMaiNguoiHours: 0,
    tyLeA1Khoan: 0,
    tyLeA2Khoan: 0,
    tyLeCatLoKhoan: 0,
    tyLePhe1Khoan: 0,
    tyLePhe2Khoan: 0,
    tyLePheHuyKhoan: 0,
    donGiaThuongA1: 0,
    donGiaThuongA2: 0,
    donGiaThuongCatLo: 0,
    donGiaPhatSanLuong: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [filteredProductionLines, setFilteredProductionLines] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    if (brickType) {
      setFormData(brickType);
    }
  }, [brickType]);

  useEffect(() => {
    // Only show production lines with IDs 1, 2, 5, 6
    const allowedLineIds = [1, 2, 5, 6];
    const filtered = productionLines.filter(
      line => allowedLineIds.includes(line.id)
    );
    setFilteredProductionLines(filtered);
  }, [productionLines]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        ...formData,
        giamKhoanTangChuKy: formData.giamKhoanTangChuKy || 0,
        id: brickType?.id || Date.now(),
        createdAt: brickType?.createdAt || new Date(),
        updatedAt: new Date()
      });
    } catch (error: any) {
      // Show error message to the user
      alert(error.message || 'Có lỗi xảy ra khi lưu loại gạch');
    }
  };

  return (
    <form className="brick-type-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="workshopId">Phân xưởng</label>
          <select
            id="workshopId"
            name="workshopId"
            value={formData.workshopId}
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
          <label htmlFor="productionLineId">Dây chuyền</label>
          <select
            id="productionLineId"
            name="productionLineId"
            value={formData.productionLineId}
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
          <label htmlFor="loaiMai">Loại mài</label>
          <select
            id="loaiMai"
            name="loaiMai"
            value={formData.loaiMai}
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
          <label htmlFor="chuKyKhoan">Chu kỳ khoán (phút)</label>
          <input
            type="number"
            id="chuKyKhoan"
            name="chuKyKhoan"
            value={formData.chuKyKhoan}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sanLuongRaLoPerDay">Sản lượng ra lò/ngày (m²)</label>
          <input
            type="number"
            id="sanLuongRaLoPerDay"
            name="sanLuongRaLoPerDay"
            value={formData.sanLuongRaLoPerDay}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sanLuongChinhPhamPerDay">Sản lượng chính phẩm/ngày (m²)</label>
          <input
            type="number"
            id="sanLuongChinhPhamPerDay"
            name="sanLuongChinhPhamPerDay"
            value={formData.sanLuongChinhPhamPerDay}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="soNgayTruKhoan">Số ngày trừ khoán</label>
          <input
            type="number"
            id="soNgayTruKhoan"
            name="soNgayTruKhoan"
            value={formData.soNgayTruKhoan}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sanLuongKhoan30Ngay">Sản lượng khoán 30 ngày (m²)</label>
          <input
            type="number"
            id="sanLuongKhoan30Ngay"
            name="sanLuongKhoan30Ngay"
            value={formData.sanLuongKhoan30Ngay}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sanLuongKhoan31Ngay">Sản lượng khoán 31 ngày (m²)</label>
          <input
            type="number"
            id="sanLuongKhoan31Ngay"
            name="sanLuongKhoan31Ngay"
            value={formData.sanLuongKhoan31Ngay}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="congKhoanGiamChuKy">Cộng khoán khi giảm chu kỳ (m²/ngày)</label>
          <input
            type="number"
            id="congKhoanGiamChuKy"
            name="congKhoanGiamChuKy"
            value={formData.congKhoanGiamChuKy}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="giamKhoanTangChuKy">Giảm khoán khi tăng chu kỳ (m²/ngày)</label>
          <input
            type="number"
            id="giamKhoanTangChuKy"
            name="giamKhoanTangChuKy"
            value={formData.giamKhoanTangChuKy}
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