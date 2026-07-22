import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPen, faChartLine, faComments, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const LandingPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  const getDashboardLink = () => {
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'mentor': return '/mentor/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/student/dashboard';
    }
  };

  const features = [
    { icon: faBook, title: 'Interactive Learning', description: 'Access structured courses with an integrated reader.' },
    { icon: faPen, title: 'Assignments', description: 'Complete assignments via Google Docs integration.' },
    { icon: faChartLine, title: 'Track Progress', description: 'Monitor your learning journey with detailed tracking.' },
    { icon: faComments, title: 'Mentor Support', description: 'Communicate directly with mentors through in-app messaging.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-impala-charcoal mb-6 font-display">
          Learn Smarter with{' '}
          <span className="text-impala-brown">ImpalaEd</span>
        </h1>
        <p className="text-xl text-impala-charcoal-muted max-w-2xl mx-auto mb-10 font-body">
          A modern learning platform designed to help students access structured
          courses, read materials seamlessly, and track their educational journey.
        </p>
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Link to={getDashboardLink()} className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
              <span>Go to Dashboard</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
                <span>Get Started Free</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-3">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-display text-impala-charcoal">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="card text-center hover:shadow-md transition-shadow">
              <div className="mb-4 text-impala-brown">
                <FontAwesomeIcon icon={feat.icon} className="text-3xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-display text-impala-charcoal">{feat.title}</h3>
              <p className="text-impala-charcoal-muted text-sm">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-impala-brown rounded-2xl text-white my-12">
        <h2 className="text-3xl font-bold mb-4 font-display">Ready to Start Learning?</h2>
        <p className="text-xl mb-8 text-impala-sand">Join ImpalaEd today and take control of your education.</p>
        {!isAuthenticated && (
          <Link to="/register" className="inline-flex items-center space-x-2 bg-impala-sand text-impala-brown px-8 py-3 rounded-lg font-semibold hover:bg-impala-sand-dark transition-colors">
            <span>Create Free Account</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
