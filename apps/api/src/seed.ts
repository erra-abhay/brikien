import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import { User } from './models/User.model';
import { Project } from './models/Project.model';
import { Blog } from './models/Blog.model';
import { Message } from './models/Message.model';
import { SiteConfig } from './models/SiteConfig.model';
import { hashPassword, hashIp } from './utils/hash.utils';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('✓ Connected to Database for seeder');

    // Clear all collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await Message.deleteMany({});
    await SiteConfig.deleteMany({});
    console.log('✓ Cleared all existing data');

    // 1 admin
    const adminPassword = await hashPassword('Admin@123456');
    const admin = await User.create({
      name: 'Abhay',
      email: 'admin@brikienlabs.tech',
      password: adminPassword,
      role: 'admin',
      slug: 'abhay',
      photo: '',
      skills: ['Node.js', 'React', 'MongoDB', 'Docker', 'AWS'],
      bio: 'Lead Full Stack Architect and Senior Engineer. Passionate about building highly scalable systems.',
      socialLinks: {
        github: 'https://github.com/abhay',
        linkedin: 'https://linkedin.com/in/abhay'
      }
    });
    console.log('✓ Created 1 admin user');

    // 2 devs
    const devPassword = await hashPassword('Dev@123456');
    const dev1 = await User.create({
      name: 'John Doe',
      email: 'john@brikienlabs.tech',
      password: devPassword,
      role: 'developer',
      slug: 'john-doe',
      photo: '',
      skills: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
      bio: 'Frontend wizard creating exceptional user experiences.',
      socialLinks: { github: 'https://github.com/johndoe' }
    });
    const dev2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@brikienlabs.tech',
      password: devPassword,
      role: 'developer',
      slug: 'jane-smith',
      photo: '',
      skills: ['Python', 'PostgreSQL', 'Redis', 'Kubernetes'],
      bio: 'Backend specialist with a focus on performance and cloud architecture.',
      socialLinks: { linkedin: 'https://linkedin.com/in/janesmith' }
    });
    console.log('✓ Created 2 developer users');

    // 2 blogs
    const blog1 = await Blog.create({
      title: 'Our First Product Launch',
      slug: 'our-first-product-launch',
      content: '<p>Developing our first product has been an amazing journey. Here is how we did it...</p><p>We focused heavily on the user experience and ensuring high performance.</p>',
      excerpt: 'A look back at the journey of building and launching our first major SaaS application.',
      featuredImage: '',
      author: admin._id,
      status: 'published',
      tags: ['launch', 'saas', 'startup']
    });
    
    await Blog.create({
      title: 'Guide to React Server Components',
      slug: 'guide-to-react-server-components',
      content: '<p>React Server components are changing how we build modern web apps. Let us dive in.</p>',
      excerpt: 'Exploring the new paradigm of RSCs in Next.js.',
      featuredImage: '',
      author: dev1._id,
      status: 'draft',
      tags: ['react', 'nextjs']
    });
    console.log('✓ Created 2 blogs');

    // 3 projects
    await Project.create({
      title: 'Brikien E-commerce Platform',
      slug: 'brikien-ecommerce',
      description: 'A fully custom built e-commerce platform with real-time analytics.',
      content: '<p>We built this platform from the ground up to solve complex scaling issues for enterprise merchants.</p>',
      status: 'completed',
      technologies: ['Next.js', 'Node.js', 'Redis', 'PostgreSQL'],
      developers: [admin._id, dev1._id],
      linkedBlog: blog1._id,
      githubUrl: 'https://github.com/brikienlabs/ecommerce',
      liveUrl: 'https://ecommerce.brikienlabs.tech'
    });

    await Project.create({
      title: 'Real-time Chat App',
      slug: 'real-time-chat',
      description: 'Encrypted peer-to-peer messaging application.',
      content: '<p>Focusing on privacy and seamless real-time communication using WebSockets.</p>',
      status: 'in-progress',
      technologies: ['React Native', 'Socket.io', 'MongoDB'],
      developers: [dev2._id]
    });

    await Project.create({
      title: 'AI Code Assistant',
      slug: 'ai-code-assistant',
      description: 'A tool for writing better code faster.',
      content: '<p>Leveraging state-of-the-art LLMs to improve developer productivity.</p>',
      status: 'upcoming',
      technologies: ['Python', 'PyTorch', 'FastAPI'],
      developers: [admin._id, dev2._id]
    });
    console.log('✓ Created 3 projects');

    // 1 SiteConfig
    await SiteConfig.create({
      startupName: 'Brikien Labs',
      tagline: 'Building the Future of Digital Innovation',
      about: {
        heading: 'Crafting Outstanding Digital Experiences',
        content: '<p>At Brikien Labs, we are a small but formidable team of passionate builders. We create cutting-edge software solutions designed to scale and succeed.</p>'
      },
      hero: {
        useGradient: true,
        backgroundImage: ''
      },
      contact: {
        email: 'hello@brikienlabs.tech',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        socialLinks: {
          github: 'https://github.com/brikienlabs',
          twitter: 'https://twitter.com/brikienlabs'
        }
      }
    });
    console.log('✓ Created 1 SiteConfig');

    // 2 messages
    await Message.create({
      name: 'Alice Investor',
      email: 'alice@vc.com',
      subject: 'Interested in Brikien Labs',
      message: 'Hello team, I love what you are building and would like to discuss potential investment.',
      ipHash: hashIp('192.168.1.1'),
      isRead: false
    });

    await Message.create({
      name: 'Bob Client',
      email: 'bob@company.com',
      subject: 'Project inquiry',
      message: 'Do you take on custom development work?',
      ipHash: hashIp('192.168.1.2'),
      isRead: true
    });
    console.log('✓ Created 2 messages');

    console.log('✅ Seed complete. Login: admin@brikienlabs.tech / Admin@123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED', error);
    process.exit(1);
  }
};

seedDatabase();
