// components/BrickTypes/BrickTypeTable.tsx
import React, { useState } from 'react';
import { BrickType } from '../../types';
import { Button } from '../Common/Button';

interface BrickTypeTableProps {
  brickTypes: BrickType[];
  onEdit: (brickType: BrickType) => void;
  onDelete: (id: number) => void;
}

export const BrickTypeTable: React.FC<BrickTypeTableProps> = ({
  brickTypes,
  onEdit,
  onDelete
}) => {
  // Group brick types by workshop and production line
  const groupedBrickTypes = brickTypes.reduce((acc, brickType) => {
    const key = `${brickType.workshop_name} - ${brickType.production_line_name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(brickType);
    return acc;
  }, {} as Record<string, BrickType[]>);

  return (
    <div className="brick-types-table-container">
      <table className="brick-types-table">
        <thead>
          <tr>
            <th rowSpan={2}>Đơn vị</th>
            <th rowSpan={2}>Kích thước SP</th>
            <th rowSpan={2}>Chu kỳ khoán</th>
            <th colSpan={2}>Sản lượng ra lò / ngày</th>
            <th rowSpan={2}>Số ngày trừ khoán</th>
            <th colSpan={2}>Sản lượng khoán</th>
            <th colSpan={2}>Cộng khoán khi giảm chu kỳ</th>
            <th colSpan={2}>Giảm khoán khi tăng chu kỳ</th>
            <th rowSpan={2}>Thao tác</th>
          </tr>
          <tr>
            <th>30</th>
            <th>31</th>
            <th>30</th>
            <th>31</th>
            <th>m²/ngày</th>
            <th>m²/ngày</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedBrickTypes).map(([groupName, types]) => (
            <React.Fragment key={groupName}>
              <tr className="group-header">
                <td colSpan={13}>{groupName}</td>
              </tr>
              {types.map((brickType) => (
                <tr key={brickType.id}>
                  <td></td>
                  <td>{brickType.name}</td>
                  <td>{brickType.chu_ky_khoan}</td>
                  <td>{brickType.san_luong_ra_lo_per_day.toLocaleString()}</td>
                  <td>{brickType.san_luong_chinh_pham_per_day.toLocaleString()}</td>
                  <td>{brickType.so_ngay_tru_khoan}</td>
                  <td>{brickType.san_luong_khoan_30_ngay.toLocaleString()}</td>
                  <td>{brickType.san_luong_khoan_31_ngay.toLocaleString()}</td>
                  <td>{brickType.cong_khoan_giam_chu_ky.toLocaleString()}</td>
                  <td>{brickType.giam_khoan_tang_chu_ky.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Button 
                        className="btn-secondary btn-small btn-margin-right"
                        onClick={() => onEdit(brickType)}
                      >
                        Sửa
                      </Button>
                      <Button 
                        className="btn-danger btn-small"
                        onClick={() => onDelete(brickType.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};