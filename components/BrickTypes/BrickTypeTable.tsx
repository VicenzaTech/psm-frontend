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
  brickTypes = [],
  onEdit,
  onDelete
}) => {
  // Group brick types by workshop and production line
  console.log("BRICK TYPES : ", brickTypes)
  const groupedBrickTypes = (brickTypes || []).reduce((acc, brickType) => {
    if (!brickType) return acc; // Skip if brickType is null/undefined
    const key = `Phân Xưởng ${brickType.workshopId || 'N/A'} - Dây chuyền ${brickType.productionLineId || 'N/A'}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(brickType);
    return acc;
  }, {} as Record<string, BrickType[]>);

  // Show message if no brick types are available
  if (!brickTypes || brickTypes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Không có dữ liệu loại gạch nào.
      </div>
    );
  }

  return (
    <div className="brick-types-table-container">
      <table className="brick-types-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên loại gạch</th>
            <th>Kích thước</th>
            <th>Chu kỳ khoan</th>
            <th>SL ra lò/ngày</th>
            <th>SL chính phẩm/ngày</th>
            <th>Số ngày trừ khoán</th>
            <th>SL khoán 30 ngày</th>
            <th>SL khoán 31 ngày</th>
            <th>Cộng khoán giảm chu kỳ</th>
            <th>Giảm khoán tăng chu kỳ</th>
            <th>Thao tác</th> {/* This column should be the last one */}
          </tr>
        </thead>

        <tbody>
          {Object.entries(groupedBrickTypes).map(([groupName, types]) => (
            <React.Fragment key={groupName}>
              <tr className="group-header">
                <td colSpan={12}>{groupName}</td> {/* Updated colspan to 12 to account for the new column */}
              </tr>
              {types.map((brickType, index) => (
                <tr key={brickType.id}>
                  <td>{index + 1}</td>
                  <td>{brickType.name}</td>
                  <td>{brickType.size_x}x{brickType.size_y}</td>
                  <td>{brickType.chuKyKhoan}</td>
                  <td>{brickType.sanLuongRaLoPerDay.toLocaleString()}</td>
                  <td>{brickType.sanLuongChinhPhamPerDay.toLocaleString()}</td>
                  <td>{brickType.soNgayTruKhoan}</td>
                  <td>{brickType.sanLuongKhoan30Ngay.toLocaleString()}</td>
                  <td>{brickType.sanLuongKhoan31Ngay.toLocaleString()}</td>
                  <td>{brickType.congKhoanGiamChuKy.toLocaleString()}</td>
                  <td>{brickType.giamKhoanTangChuKy.toLocaleString()}</td>
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
                        Xoá
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