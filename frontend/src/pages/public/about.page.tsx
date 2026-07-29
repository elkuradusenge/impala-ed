import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faGraduationCap,
  faHandshake,
  faLightbulb,
  faUsers,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';

const values = [
  {
    icon: faLightbulb,
    title: 'Innovation in Learning',
    description: 'We believe education should evolve with technology. Our platform combines traditional academic rigor with modern digital tools to create an engaging learning experience.',
  },
  {
    icon: faUsers,
    title: 'Community Driven',
    description: 'Learning is a collaborative journey. We foster a vibrant community where students, teachers, and mentors connect, share knowledge, and grow together.',
  },
  {
    icon: faHandshake,
    title: 'Accessibility First',
    description: 'Quality education should be available to everyone. We are committed to breaking down barriers and making learning resources accessible to all.',
  },
  {
    icon: faGraduationCap,
    title: 'Mentorship & Growth',
    description: 'Every student deserves guidance. Our mentorship model pairs learners with experienced teachers who provide personalized support and real-world insights.',
  },
  {
    icon: faGlobe,
    title: 'Global Perspective',
    description: 'Education knows no borders. We connect learners across Africa and beyond, bringing diverse perspectives and preparing students for a global future.',
  },
  {
    icon: faBookOpen,
    title: 'Continuous Improvement',
    description: 'We are constantly evolving based on feedback and emerging needs. Our platform grows with our community, always striving to do better.',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-impala-brown/10 text-impala-brown mb-6">
          <FontAwesomeIcon icon={faBookOpen} className="text-4xl" />
        </div>
        <h1 className="text-4xl font-bold font-display text-impala-charcoal mb-4">
          About ImpalaEd
        </h1>
        <p className="text-lg text-impala-charcoal-muted max-w-3xl mx-auto leading-relaxed">
          Empowering the next generation of learners through accessible, mentor-guided,
          and technology-driven education.
        </p>
      </section>

      {/* Our Story */}
      <section className="card-white mb-10">
        <h2 className="text-2xl font-bold font-display text-impala-charcoal mb-4">Our Story</h2>
        <div className="prose max-w-none text-impala-charcoal-muted space-y-4">
          <p>
            ImpalaEd was born from a simple yet powerful belief: <strong>education changes everything</strong>.
            Named after the impala — a swift and resilient antelope native to Africa — our platform embodies
            the same spirit of agility, strength, and adaptability.
          </p>
          <p>
            We started with a vision to bridge the gap between traditional classroom learning and the
            digital future. Today, ImpalaEd is a comprehensive learning management platform that connects
            students with expert teachers, provides structured course materials, and tracks progress every
            step of the way.
          </p>
          <p>
            From interactive PDF-based lessons to real-time messaging with mentors, from detailed
            progress tracking to seamless assignment management — every feature is designed with one
            goal in mind: <strong>to make learning more effective, engaging, and accessible</strong>.
          </p>
        </div>
      </section>

      {/* Our Philosophy / Values */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold font-display text-impala-charcoal mb-6 text-center">
          Our Philosophy
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div key={i} className="card text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-impala-brown/10 text-impala-brown mb-4">
                <FontAwesomeIcon icon={v.icon} className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold font-display text-impala-charcoal mb-2">{v.title}</h3>
              <p className="text-sm text-impala-charcoal-muted leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-impala-brown rounded-2xl text-white mb-8">
        <h2 className="text-2xl font-bold mb-3 font-display">Ready to Join Us?</h2>
        <p className="text-impala-sand mb-6 max-w-xl mx-auto">
          Whether you're a student ready to learn or a teacher ready to inspire,
          ImpalaEd is here for you.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/register"
            className="bg-impala-sand text-impala-brown px-6 py-2.5 rounded-lg font-semibold hover:bg-impala-sand-dark transition-colors"
          >
            Get Started
          </a>
          <a
            href="/courses"
            className="border border-impala-sand text-impala-sand px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Browse Courses
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
