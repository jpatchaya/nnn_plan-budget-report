// Budget Management Types

export enum BudgetType {
  OPERATING = 'OPERATING', // งบดำเนินงาน
  INVESTMENT = 'INVESTMENT', // งบลงทุน
  PERSONNEL = 'PERSONNEL', // งบบุคลากร
  SUBSIDY = 'SUBSIDY', // งบอุดหนุน
  OTHER = 'OTHER' // งบรายจ่ายอื่น
}

export enum BudgetStatus {
  DRAFT = 'DRAFT', // ร่าง
  SUBMITTED = 'SUBMITTED', // ส่งแล้ว
  REVIEWING = 'REVIEWING', // กำลังพิจารณา
  APPROVED = 'APPROVED', // อนุมัติ
  REJECTED = 'REJECTED', // ไม่อนุมัติ
  REVISED = 'REVISED' // แก้ไข
}

export enum FiscalYear {
  FY2567 = '2567',
  FY2568 = '2568',
  FY2569 = '2569',
  FY2570 = '2570'
}

export interface BudgetRequest {
  id: string
  requestNumber: string // เลขที่คำขอ
  fiscalYear: FiscalYear // ปีงบประมาณ
  department: string // หน่วยงาน
  departmentCode: string
  budgetType: BudgetType
  projectName: string // ชื่อโครงการ
  projectCode?: string // รหัสโครงการ
  objective: string // วัตถุประสงค์
  expectedResults: string // ผลที่คาดว่าจะได้รับ
  targetGroup: string // กลุ่มเป้าหมาย
  location: string // สถานที่ดำเนินการ
  startDate: Date
  endDate: Date
  requestedAmount: number // จำนวนเงินที่ขอ
  approvedAmount?: number // จำนวนเงินที่อนุมัติ
  items: BudgetItem[] // รายการค่าใช้จ่าย
  attachments: Attachment[] // เอกสารแนบ
  justification: string // เหตุผลความจำเป็น
  status: BudgetStatus
  createdBy: string
  createdDate: Date
  updatedDate?: Date
  reviewedBy?: string
  reviewedDate?: Date
  reviewComments?: string
  quarter: 1 | 2 | 3 | 4 // ไตรมาส
}

export interface BudgetItem {
  id: string
  category: string // หมวดค่าใช้จ่าย
  description: string // รายละเอียด
  unit: string // หน่วยนับ
  quantity: number // จำนวน
  pricePerUnit: number // ราคาต่อหน่วย
  totalAmount: number // จำนวนเงินรวม
  quarter: 1 | 2 | 3 | 4 // ไตรมาสที่ใช้
  notes?: string
}

export interface Attachment {
  id: string
  filename: string
  fileType: string
  fileSize: number
  uploadedDate: Date
  uploadedBy: string
  url: string
}

export interface BudgetAllocation {
  id: string
  fiscalYear: FiscalYear
  department: string
  departmentCode: string
  totalBudget: number // งบประมาณรวม
  allocatedBudget: number // งบที่จัดสรรแล้ว
  remainingBudget: number // งบคงเหลือ
  allocations: {
    operating: number
    investment: number
    personnel: number
    subsidy: number
    other: number
  }
  monthlyPlan: MonthlyBudgetPlan[]
}

export interface MonthlyBudgetPlan {
  month: number // 1-12
  plannedAmount: number
  actualAmount: number
  variance: number // ผลต่าง
}

export interface BudgetTransfer {
  id: string
  transferNumber: string
  fiscalYear: FiscalYear
  fromDepartment: string
  toDepartment: string
  fromBudgetType: BudgetType
  toBudgetType: BudgetType
  fromProject?: string
  toProject?: string
  transferAmount: number
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedBy: string
  requestedDate: Date
  approvedBy?: string
  approvedDate?: Date
  comments?: string
}

export interface BudgetSummary {
  fiscalYear: FiscalYear
  totalBudget: number
  totalAllocated: number
  totalSpent: number
  totalRemaining: number
  byDepartment: {
    department: string
    allocated: number
    spent: number
    remaining: number
    percentage: number
  }[]
  byType: {
    type: BudgetType
    allocated: number
    spent: number
    remaining: number
    percentage: number
  }[]
  byQuarter: {
    quarter: 1 | 2 | 3 | 4
    planned: number
    actual: number
    variance: number
  }[]
}