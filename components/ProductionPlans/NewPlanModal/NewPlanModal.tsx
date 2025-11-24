import React, { useState } from 'react';
import { BrickType, ProductionLine, ProductionPlan } from '../../../types';
import { brickTypes, productionLines } from '../../../data/mockData';
import { Button } from '../../Common/Button';
import styles from './NewPlanModal.module.css';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (plan: ProductionPlan) => void;
};

const NewPlanModal: React.FC<Props> = ({ visible, onClose, onCreate }) => {
  const [productionLineId, setProductionLineId] = useState<number>(productionLines[0]?.id || 1);
  const [brickTypeId, setBrickTypeId] = useState<number>(brickTypes[0]?.id || 5);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [targetQuantity, setTargetQuantity] = useState<number>(1000);
  const [targetMetric, setTargetMetric] = useState<string>('target_quantity');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    // Basic validation
    const errors: string[] = [];
    if (!startDate) errors.push('Chưa chọn ngày bắt đầu');
    if (!endDate) errors.push('Chưa chọn ngày kết thúc');
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) errors.push('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu');
    if (targetQuantity <= 0) errors.push('Số lượng mục tiêu phải lớn hơn 0');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Date.now();
    const prodLine = productionLines.find((p) => p.id === productionLineId) as ProductionLine;
    const brick = brickTypes.find((b) => b.id === brickTypeId) as BrickType;

    const newPlan: ProductionPlan = {
      id: newId,
      plan_code: `PLAN-${prodLine.code}-${new Date(startDate).toISOString().slice(0,10)}`,
      production_line_id: prodLine.id,
      brick_type_id: brick.id,
      start_date: startDate,
      end_date: endDate,
      target_quantity: targetQuantity,
      actual_quantity: 0,
      completion_percentage: 0,
      status: 'draft',
      created_by: 'user_local',
      production_line: prodLine,
      brick_type: brick
    };

    setIsSubmitting(true);
    setFormErrors([]);
    try {
      // TODO: Send newPlan to backend API here (POST /production-plans).
      // Example (fetch):
      // const resp = await fetch('/api/production-plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPlan) });
      // const created = await resp.json();
      // onCreate(created);

      // For now, call onCreate with local object so UI updates immediately.
      onCreate(newPlan);
      onClose();
    } catch (err) {
      console.error('Create plan error', err);
      setFormErrors(['Lỗi khi tạo kế hoạch. Vui lòng thử lại.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.title}>Tạo kế hoạch mới</div>
          <div>
            <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Dây chuyền</label>
            <select value={productionLineId} onChange={(e) => { setProductionLineId(Number(e.target.value)); setFormErrors([]); }}>
              {productionLines.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Dòng gạch</label>
            <select value={brickTypeId} onChange={(e) => { setBrickTypeId(Number(e.target.value)); setFormErrors([]); }}>
              {brickTypes.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Ngày bắt đầu</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setFormErrors([]); }} />
          </div>

          <div className={styles.field}>
            <label>Ngày kết thúc</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setFormErrors([]); }} />
          </div>

          <div className={styles.field}>
            <label>Chỉ tiêu</label>
            <select value={targetMetric} onChange={(e) => { setTargetMetric(e.target.value); setFormErrors([]); }}>
              <option value="target_quantity">Sản lượng (m²)</option>
              <option value="defect_rate">Tỉ lệ lỗi (%)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Số lượng mục tiêu</label>
            <input type="number" value={targetQuantity} onChange={(e) => { setTargetQuantity(Number(e.target.value)); setFormErrors([]); }} />
          </div>
        </div>
        {formErrors.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {formErrors.map((e, idx) => (
              <div key={idx} className={styles.errorText}>{e}</div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <Button variant="secondary" className={styles.btnSecondary} onClick={onClose} disabled={isSubmitting}>Hủy</Button>
          <Button variant="primary" className={styles.btnPrimary} onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Đang tạo...' : 'Tạo'}</Button>
        </div>
      </div>
    </div>
  );
};

export default NewPlanModal;
