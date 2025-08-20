# Plan Budget Report System

## Project Overview

ระบบแผนงาน งบประมาณ และการรายงานผล (Plan Budget Report System) สำหรับกรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช

## Technologies Used

This project is built with:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library
- **shadcn/ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and caching

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

## Getting Started

Follow these steps to run the project locally:

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd plan-budget-report

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Structure

```
├── app/                # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── [route]/        # Individual page routes
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── budget/        # Business components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── public/            # Static assets
└── styles/            # Global styles
```

## Features

- **งบประมาณ** - จัดการคำของบประมาณ แผนปฏิบัติงาน และการจัดสรรงบประมาณ
- **รายงาน** - ระบบรายงานผลการดำเนินงานและการเบิกจ่าย
- **ผู้ใช้งาน** - ระบบจัดการผู้ใช้และสิทธิ์การเข้าถึง
- **การตั้งค่า** - กำหนดค่าระบบและความปลอดภัย

## Pages

- `/` - Dashboard หน้าหลัก
- `/login` - เข้าสู่ระบบ
- `/master-data` - ข้อมูลหลัก
- `/budget-request` - คำของบประมาณ
- `/work-plan` - แผนปฏิบัติงาน
- `/allocation` - จัดสรรกรอบวงเงิน
- `/transfer` - โอน/เปลี่ยนแปลงงบประมาณ
- `/reports` - รายงานผลการดำเนินงาน
- `/import-budget` - นำเข้าข้อมูล พ.ร.บ.
- `/compare` - เปรียบเทียบงบประมาณ
- `/export` - ส่งออกข้อมูล
- `/dpis` - เชื่อมโยง DPIS
- `/users` - จัดการผู้ใช้งาน
- `/settings` - ตั้งค่าระบบ

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2024 Department of National Parks, Wildlife and Plant Conservation