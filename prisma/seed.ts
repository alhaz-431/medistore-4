import { Role } from './../generated/prisma/enums';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
const prisma = new PrismaClient()

async function main() {
  // পাসওয়ার্ড হ্যাশ করা হচ্ছে (নিরাপত্তার জন্য)
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@medistore.com' },
    update: {},
    create: {
      email: 'admin@medistore.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.ADMIN, // আপনার Schema অনুযায়ী
      status: 'active'
    },
  })

  console.log('✅ Admin user created/verified:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })