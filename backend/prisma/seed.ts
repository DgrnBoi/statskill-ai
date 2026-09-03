import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional, useful for development)
  await prisma.enrollment.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.competency.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleared. Seeding MoSPI Competencies...');

  const competencies = await Promise.all([
    prisma.competency.create({ data: { skillName: 'Sampling Theory', targetLevel: 4, category: 'Statistical' } }),
    prisma.competency.create({ data: { skillName: 'Data Visualization', targetLevel: 3, category: 'Technical' } }),
    prisma.competency.create({ data: { skillName: 'Time Series Analysis', targetLevel: 4, category: 'Statistical' } }),
    prisma.competency.create({ data: { skillName: 'Data Privacy (DPDP)', targetLevel: 3, category: 'Administrative' } })
  ]);

  console.log('Seeding Mock iGOT Courses...');

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Advanced Sampling Techniques for Surveys',
        description: 'Comprehensive guide to stratified and cluster sampling.',
        skillsCovered: ['Sampling Theory'],
        provider: 'iGOT'
      }
    }),
    prisma.course.create({
      data: {
        title: 'Dashboard Design with AI',
        description: 'Learn modern data visualization principles and UI/UX.',
        skillsCovered: ['Data Visualization'],
        provider: 'iGOT'
      }
    }),
    prisma.course.create({
      data: {
        title: 'DPDP Act Compliance for Officials',
        description: 'Mandatory training for handling sensitive government data.',
        skillsCovered: ['Data Privacy (DPDP)'],
        provider: 'iGOT'
      }
    })
  ]);

  console.log('Seeding Mock User (MoSPI Official)...');

  const user = await prisma.user.create({
    data: {
      name: 'Aditi Sharma',
      email: 'aditi.sharma@mospi.gov.in',
      designation: 'Joint Director',
      department: 'National Statistical Office (NSO)'
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
