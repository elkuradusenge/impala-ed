import { PrismaClient, DifficultyLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ImpalaEd database...');

  // ── Create Default Admin ──
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@impalaed.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@impalaed.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isVerified: true,
      bio: 'Platform administrator',
    },
  });
  console.log(`  ✅ Admin: ${admin.email}`);

  // ── Create Demo Mentor ──
  const mentorPassword = await bcrypt.hash('mentor123', 10);
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@impalaed.com' },
    update: {},
    create: {
      name: 'Jean-Luc Habimana',
      email: 'mentor@impalaed.com',
      password: mentorPassword,
      role: 'mentor',
      isActive: true,
      isVerified: true,
      bio: 'Experienced software engineer and educator passionate about technology education.',
    },
  });
  console.log(`  ✅ Mentor: ${mentor.email}`);

  // ── Create Categories ──
  const categories = [
    { name: 'Technology', description: 'Software development, AI, data science, and cybersecurity' },
    { name: 'Design', description: 'UI/UX design, graphic design, and digital creativity' },
    { name: 'Business', description: 'Entrepreneurship, management, and business strategy' },
    { name: 'Science', description: 'Mathematics, physics, biology, and research methods' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.courseCategory.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: cat,
    });
    createdCategories[cat.name] = created.id;
    console.log(`  ✅ Category: ${cat.name}`);
  }

  // ── Create Courses ──
  const courses = [
    {
      title: 'Web Development',
      category: 'Technology',
      difficultyLevel: 'beginner' as DifficultyLevel,
      duration: '12 weeks',
      description: 'Learn modern frontend and backend development. Master HTML, CSS, JavaScript, React, Node.js, and build full-stack web applications from scratch.',
      shortDescription: 'Learn modern frontend and backend development',
      learningObjectives: [
        'Build responsive web pages with HTML and CSS',
        'Create interactive UIs with JavaScript and React',
        'Develop RESTful APIs with Node.js and Express',
        'Work with databases using PostgreSQL and Prisma',
      ],
    },
    {
      title: 'Mobile Application Development',
      category: 'Technology',
      difficultyLevel: 'intermediate' as DifficultyLevel,
      duration: '14 weeks',
      description: 'Build Android and iOS applications using modern frameworks. Learn Flutter and React Native to create cross-platform mobile experiences.',
      shortDescription: 'Build Android and iOS applications',
      learningObjectives: [
        'Set up mobile development environments',
        'Build cross-platform UIs with Flutter',
        'Integrate APIs and backend services',
        'Publish apps to Google Play and App Store',
      ],
    },
    {
      title: 'Data Science',
      category: 'Technology',
      difficultyLevel: 'intermediate' as DifficultyLevel,
      duration: '10 weeks',
      description: 'Learn data analysis, visualization, and machine learning. Work with Python, pandas, scikit-learn, and real-world datasets.',
      shortDescription: 'Learn data analysis and machine learning',
      learningObjectives: [
        'Manipulate data with pandas and NumPy',
        'Create visualizations with matplotlib and seaborn',
        'Apply statistical analysis to real datasets',
        'Build machine learning models with scikit-learn',
      ],
    },
    {
      title: 'Artificial Intelligence',
      category: 'Technology',
      difficultyLevel: 'advanced' as DifficultyLevel,
      duration: '16 weeks',
      description: 'Explore AI concepts including neural networks, natural language processing, and computer vision. Build intelligent systems.',
      shortDescription: 'Explore AI concepts and applications',
      learningObjectives: [
        'Understand neural network architectures',
        'Implement NLP models with transformers',
        'Build computer vision applications',
        'Deploy AI models to production',
      ],
    },
    {
      title: 'Cyber Security',
      category: 'Technology',
      difficultyLevel: 'intermediate' as DifficultyLevel,
      duration: '12 weeks',
      description: 'Protect systems and networks from digital attacks. Learn network security, ethical hacking, cryptography, and security best practices.',
      shortDescription: 'Protect systems and networks from digital attacks',
      learningObjectives: [
        'Understand network security fundamentals',
        'Perform vulnerability assessments',
        'Implement encryption and authentication',
        'Respond to security incidents',
      ],
    },
    {
      title: 'UI/UX Design',
      category: 'Design',
      difficultyLevel: 'beginner' as DifficultyLevel,
      duration: '8 weeks',
      description: 'Create user-centered digital experiences. Master design thinking, wireframing, prototyping, and user research methodologies.',
      shortDescription: 'Create user-centered digital experiences',
      learningObjectives: [
        'Apply design thinking methodology',
        'Create wireframes and prototypes in Figma',
        'Conduct user research and usability testing',
        'Design accessible and inclusive interfaces',
      ],
    },
    {
      title: 'Graphic Design',
      category: 'Design',
      difficultyLevel: 'beginner' as DifficultyLevel,
      duration: '8 weeks',
      description: 'Master visual communication through typography, color theory, composition, and digital illustration. Learn industry-standard tools.',
      shortDescription: 'Master visual communication and digital illustration',
      learningObjectives: [
        'Apply color theory and typography principles',
        'Create vector illustrations',
        'Design brand identities and logos',
        'Prepare files for print and digital media',
      ],
    },
    {
      title: 'Entrepreneurship',
      category: 'Business',
      difficultyLevel: 'beginner' as DifficultyLevel,
      duration: '10 weeks',
      description: 'Learn how to start and grow a successful business. Cover business model canvas, fundraising, marketing, and scaling strategies.',
      shortDescription: 'Learn how to start and grow a successful business',
      learningObjectives: [
        'Develop a business model canvas',
        'Create a go-to-market strategy',
        'Understand fundraising and financial planning',
        'Build and lead effective teams',
      ],
    },
  ];

  for (const course of courses) {
    const existing = await prisma.course.findFirst({
      where: { title: course.title, mentorId: mentor.id },
    });

    if (!existing) {
      await prisma.course.create({
        data: {
          title: course.title,
          description: course.description,
          shortDescription: course.shortDescription,
          categoryId: createdCategories[course.category],
          mentorId: mentor.id,
          difficultyLevel: course.difficultyLevel,
          duration: course.duration,
          learningObjectives: course.learningObjectives,
          isPublished: true,
          isApproved: true,
          isFeatured: ['Web Development', 'Data Science', 'AI'].includes(course.title),
        },
      });
      console.log(`  ✅ Course: ${course.title}`);
    } else {
      console.log(`  ⏭️  Course already exists: ${course.title}`);
    }
  }

  // ── Create Demo Student ──
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@impalaed.com' },
    update: {},
    create: {
      name: 'Amina Uwase',
      email: 'student@impalaed.com',
      password: studentPassword,
      role: 'student',
      isActive: true,
      isVerified: true,
      bio: 'Aspiring software developer passionate about technology and design.',
    },
  });
  console.log(`  ✅ Student: ${student.email}`);

  console.log('\n🎉 Seeding complete!');
  console.log('   Demo accounts:');
  console.log('   - admin@impalaed.com / admin123');
  console.log('   - mentor@impalaed.com / mentor123');
  console.log('   - student@impalaed.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
