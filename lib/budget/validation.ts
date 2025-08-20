import { z } from 'zod'
import { BudgetType, BudgetStatus, FiscalYear } from './types'

// Budget item validation schema
export const budgetItemSchema = z.object({
  category: z.string().min(1, 'กรุณาระบุหมวดค่าใช้จ่าย'),
  description: z.string().min(1, 'กรุณาระบุรายละเอียด'),
  unit: z.string().min(1, 'กรุณาระบุหน่วยนับ'),
  quantity: z.number().min(1, 'จำนวนต้องมากกว่า 0'),
  pricePerUnit: z.number().min(0, 'ราคาต่อหน่วยต้องมากกว่าหรือเท่ากับ 0'),
  totalAmount: z.number().min(0, 'จำนวนเงินรวมต้องมากกว่าหรือเท่ากับ 0'),
  quarter: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  notes: z.string().optional()
})

// Main budget request validation schema
export const budgetRequestSchema = z.object({
  fiscalYear: z.nativeEnum(FiscalYear, {
    errorMap: () => ({ message: 'กรุณาเลือกปีงบประมาณ' })
  }),
  department: z.string().min(1, 'กรุณาระบุหน่วยงาน'),
  departmentCode: z.string().min(1, 'กรุณาระบุรหัสหน่วยงาน'),
  budgetType: z.nativeEnum(BudgetType, {
    errorMap: () => ({ message: 'กรุณาเลือกประเภทงบประมาณ' })
  }),
  projectName: z.string()
    .min(5, 'ชื่อโครงการต้องมีอย่างน้อย 5 ตัวอักษร')
    .max(200, 'ชื่อโครงการต้องไม่เกิน 200 ตัวอักษร'),
  projectCode: z.string().optional(),
  objective: z.string()
    .min(10, 'วัตถุประสงค์ต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(1000, 'วัตถุประสงค์ต้องไม่เกิน 1000 ตัวอักษร'),
  expectedResults: z.string()
    .min(10, 'ผลที่คาดว่าจะได้รับต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(1000, 'ผลที่คาดว่าจะได้รับต้องไม่เกิน 1000 ตัวอักษร'),
  targetGroup: z.string()
    .min(3, 'กรุณาระบุกลุ่มเป้าหมาย')
    .max(500, 'กลุ่มเป้าหมายต้องไม่เกิน 500 ตัวอักษร'),
  location: z.string()
    .min(3, 'กรุณาระบุสถานที่ดำเนินการ')
    .max(500, 'สถานที่ดำเนินการต้องไม่เกิน 500 ตัวอักษร'),
  startDate: z.date({
    required_error: 'กรุณาระบุวันที่เริ่มต้น',
    invalid_type_error: 'วันที่เริ่มต้นไม่ถูกต้อง'
  }),
  endDate: z.date({
    required_error: 'กรุณาระบุวันที่สิ้นสุด',
    invalid_type_error: 'วันที่สิ้นสุดไม่ถูกต้อง'
  }),
  requestedAmount: z.number()
    .min(1, 'จำนวนเงินที่ขอต้องมากกว่า 0')
    .max(1000000000, 'จำนวนเงินที่ขอต้องไม่เกิน 1,000 ล้านบาท'),
  items: z.array(budgetItemSchema)
    .min(1, 'ต้องมีรายการค่าใช้จ่ายอย่างน้อย 1 รายการ'),
  justification: z.string()
    .min(20, 'เหตุผลความจำเป็นต้องมีอย่างน้อย 20 ตัวอักษร')
    .max(2000, 'เหตุผลความจำเป็นต้องไม่เกิน 2000 ตัวอักษร'),
  quarter: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)], {
    errorMap: () => ({ message: 'กรุณาเลือกไตรมาส' })
  })
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: 'วันที่สิ้นสุดต้องมาหลังวันที่เริ่มต้น',
    path: ['endDate']
  }
).refine(
  (data) => {
    const itemsTotal = data.items.reduce((sum, item) => sum + item.totalAmount, 0)
    return Math.abs(itemsTotal - data.requestedAmount) < 0.01 // Allow small floating point differences
  },
  {
    message: 'ยอดรวมของรายการค่าใช้จ่ายต้องเท่ากับจำนวนเงินที่ขอ',
    path: ['requestedAmount']
  }
)

// Budget transfer validation schema
export const budgetTransferSchema = z.object({
  fiscalYear: z.nativeEnum(FiscalYear),
  fromDepartment: z.string().min(1, 'กรุณาระบุหน่วยงานต้นทาง'),
  toDepartment: z.string().min(1, 'กรุณาระบุหน่วยงานปลายทาง'),
  fromBudgetType: z.nativeEnum(BudgetType),
  toBudgetType: z.nativeEnum(BudgetType),
  fromProject: z.string().optional(),
  toProject: z.string().optional(),
  transferAmount: z.number()
    .min(1, 'จำนวนเงินโอนต้องมากกว่า 0')
    .max(1000000000, 'จำนวนเงินโอนต้องไม่เกิน 1,000 ล้านบาท'),
  reason: z.string()
    .min(20, 'เหตุผลในการโอนต้องมีอย่างน้อย 20 ตัวอักษร')
    .max(1000, 'เหตุผลในการโอนต้องไม่เกิน 1000 ตัวอักษร')
})

// Helper function to validate Thai fiscal year
export function validateFiscalYear(year: string): boolean {
  const currentYear = new Date().getFullYear() + 543 // Convert to Buddhist Era
  const fiscalYear = parseInt(year)
  // Allow current year and next 3 years
  return fiscalYear >= currentYear && fiscalYear <= currentYear + 3
}

// Helper function to format currency in Thai Baht
export function formatThaiCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Helper function to validate budget limits
export function validateBudgetLimit(
  requestedAmount: number,
  departmentLimit: number,
  budgetType: BudgetType
): { isValid: boolean; message?: string } {
  // Check overall limit
  if (requestedAmount > departmentLimit) {
    return {
      isValid: false,
      message: `จำนวนเงินที่ขอเกินวงเงินของหน่วยงาน (${formatThaiCurrency(departmentLimit)})`
    }
  }

  // Check specific budget type limits (example business rules)
  const limits: Record<BudgetType, number> = {
    [BudgetType.OPERATING]: departmentLimit * 0.6, // 60% for operating
    [BudgetType.INVESTMENT]: departmentLimit * 0.3, // 30% for investment
    [BudgetType.PERSONNEL]: departmentLimit * 0.5, // 50% for personnel
    [BudgetType.SUBSIDY]: departmentLimit * 0.2, // 20% for subsidy
    [BudgetType.OTHER]: departmentLimit * 0.1 // 10% for other
  }

  if (requestedAmount > limits[budgetType]) {
    return {
      isValid: false,
      message: `จำนวนเงินที่ขอเกินวงเงินสำหรับ${getBudgetTypeName(budgetType)} (${formatThaiCurrency(limits[budgetType])})`
    }
  }

  return { isValid: true }
}

// Helper function to get Thai budget type name
export function getBudgetTypeName(type: BudgetType): string {
  const names: Record<BudgetType, string> = {
    [BudgetType.OPERATING]: 'งบดำเนินงาน',
    [BudgetType.INVESTMENT]: 'งบลงทุน',
    [BudgetType.PERSONNEL]: 'งบบุคลากร',
    [BudgetType.SUBSIDY]: 'งบอุดหนุน',
    [BudgetType.OTHER]: 'งบรายจ่ายอื่น'
  }
  return names[type]
}

// Helper function to get Thai budget status name
export function getBudgetStatusName(status: BudgetStatus): string {
  const names: Record<BudgetStatus, string> = {
    [BudgetStatus.DRAFT]: 'ร่าง',
    [BudgetStatus.SUBMITTED]: 'ส่งแล้ว',
    [BudgetStatus.REVIEWING]: 'กำลังพิจารณา',
    [BudgetStatus.APPROVED]: 'อนุมัติ',
    [BudgetStatus.REJECTED]: 'ไม่อนุมัติ',
    [BudgetStatus.REVISED]: 'แก้ไข'
  }
  return names[status]
}