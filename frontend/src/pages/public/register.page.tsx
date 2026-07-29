import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth.hook';
import { useSaveCourseInterests, useAvailableInterests } from '../../hooks/use-interest.hook';
import LoadingSpinner from '../../components/LoadingSpinner.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faBookOpen,
  faSpinner,
  faUserGraduate,
  faChalkboardTeacher,
  faPhone,
  faBriefcase,
  faStar,
  faCheck,
  faArrowRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

type RegisterRole = 'student' | 'mentor';
type FormStep = 'personal' | 'interests';

const STEPS: { key: FormStep; label: string }[] = [
  { key: 'personal', label: 'Personal Information' },
  { key: 'interests', label: 'Interested Courses' },
];

const RegisterPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading, register } = useAuth();
  const navigate = useNavigate();

  // ALL hooks must be called unconditionally before any early return
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null);
  const [page, setPage] = useState<'role' | 'form'>('role');
  const [formStep, setFormStep] = useState<FormStep>('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    teachingExperience: '',
    expertiseArea: '',
    selectedCourses: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const saveInterests = useSaveCourseInterests();
  const { data: availableCourses, isLoading: interestsLoading } = useAvailableInterests();

  // Redirect authenticated users away from register page
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isStudent = selectedRole === 'student';
  const currentStepIndex = STEPS.findIndex((s) => s.key === formStep);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter((id) => id !== courseId)
        : [...prev.selectedCourses, courseId],
    }));
  };

  const selectRole = (role: RegisterRole) => {
    setSelectedRole(role);
    setPage('form');
    setFormStep('personal');
  };

  const goBackToRole = () => {
    setPage('role');
    setSelectedRole(null);
    setError('');
  };

  const validatePersonalStep = (): boolean => {
    setError('');
    if (!formData.name.trim()) { setError('Full name is required'); return false; }
    if (!formData.email.trim()) { setError('Email is required'); return false; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const handleNext = () => {
    if (formStep === 'personal') {
      if (!validatePersonalStep()) return;
      setFormStep('interests');
    }
  };

  const handleBack = () => {
    if (formStep === 'interests') {
      setFormStep('personal');
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.selectedCourses.length === 0) {
      setError('Please select at least one course interest');
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, selectedRole || 'student');

      if (formData.selectedCourses.length > 0) {
        await saveInterests.mutateAsync(formData.selectedCourses);
      }

      toast.success(`Welcome to ImpalaEd, ${user.name}!`);
      const routes: Record<string, string> = {
        student: '/student/dashboard',
        mentor: '/mentor/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(routes[user.role] || '/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Role Selection Screen ──
  if (page === 'role') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-impala-brown/10 text-impala-brown mb-4">
              <FontAwesomeIcon icon={faBookOpen} className="text-3xl" />
            </div>
            <h1 className="text-3xl font-bold font-display text-impala-charcoal">Create Your Account</h1>
            <p className="text-impala-charcoal-muted mt-1">Choose how you want to join ImpalaEd</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => selectRole('student')}
              className="card text-center hover:shadow-lg transition-all group border-2 border-transparent hover:border-impala-brown cursor-pointer text-left"
            >
              <div className="flex flex-col items-center py-6">
                <div className="w-20 h-20 rounded-full bg-impala-brown/10 text-impala-brown flex items-center justify-center mb-4 group-hover:bg-impala-brown group-hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold font-display text-impala-charcoal mb-2">Student</h3>
                <p className="text-impala-charcoal-muted text-sm text-center">
                  Access courses, complete assignments, and track your learning progress
                </p>
                <span className="mt-4 inline-flex items-center space-x-1 text-impala-brown font-medium text-sm group-hover:underline">
                  <span>Register as Student</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </span>
              </div>
            </button>

            <button
              onClick={() => selectRole('mentor')}
              className="card text-center hover:shadow-lg transition-all group border-2 border-transparent hover:border-emerald-500 cursor-pointer text-left"
            >
              <div className="flex flex-col items-center py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold font-display text-impala-charcoal mb-2">Teacher</h3>
                <p className="text-impala-charcoal-muted text-sm text-center">
                  Create courses, manage lessons, and guide students on their learning journey
                </p>
                <span className="mt-4 inline-flex items-center space-x-1 text-emerald-600 font-medium text-sm group-hover:underline">
                  <span>Register as Teacher</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </span>
              </div>
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-impala-charcoal-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-impala-brown hover:text-impala-brown-dark font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Step Indicator ──
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((s, i) => {
        const isActive = formStep === s.key;
        const isPast = currentStepIndex > i;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-impala-brown text-white shadow-md'
                    : isPast
                    ? 'bg-impala-green text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isPast ? <FontAwesomeIcon icon={faCheck} className="text-xs" /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${isActive ? 'text-impala-brown' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 mb-5 ${currentStepIndex > i ? 'bg-impala-green' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Step 1: Personal Information ──
  const renderPersonalStep = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-impala-charcoal mb-3 uppercase tracking-wider">
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Full Name</label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field pl-10" required placeholder="John Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Email</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-10" required placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Phone Number</label>
            <div className="relative">
              <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input-field pl-10" placeholder="+250 700 000 000" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-impala-charcoal mb-3 uppercase tracking-wider">Security</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Password</label>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field pl-10" required placeholder="At least 6 characters" minLength={6} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-impala-charcoal mb-1">Confirm Password</label>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field pl-10" required placeholder="Repeat your password" />
            </div>
          </div>
        </div>
      </div>

      {selectedRole === 'mentor' && (
        <div>
          <h3 className="text-sm font-semibold text-impala-charcoal mb-3 uppercase tracking-wider">Professional Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Teaching Experience</label>
              <div className="relative">
                <FontAwesomeIcon icon={faBriefcase} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
                <input type="text" name="teachingExperience" value={formData.teachingExperience} onChange={handleChange} className="input-field pl-10" placeholder="e.g., 5 years" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-impala-charcoal mb-1">Expertise Area</label>
              <div className="relative">
                <FontAwesomeIcon icon={faStar} className="absolute left-3 top-1/2 -translate-y-1/2 text-impala-charcoal-muted text-sm" />
                <input type="text" name="expertiseArea" value={formData.expertiseArea} onChange={handleChange} className="input-field pl-10" placeholder="e.g., Web Development" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Step 2: Interested Courses ──
  const renderInterestsStep = () => (
    <div>
      <h3 className="text-sm font-semibold text-impala-charcoal mb-3 uppercase tracking-wider">
        {selectedRole === 'student' ? 'Interested Courses' : 'Courses Interested In'}
      </h3>
      <p className="text-xs text-impala-charcoal-muted mb-3">
        Select the courses you are interested in{selectedRole === 'mentor' ? ' teaching' : ''}
      </p>
      {interestsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : !availableCourses || availableCourses.length === 0 ? (
        <p className="text-center text-impala-charcoal-muted py-8">
          No courses available yet. You can skip this step and browse later.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {(availableCourses as any[]).map((course: any) => {
            const isSelected = formData.selectedCourses.includes(course.id);
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => toggleCourse(course.id)}
                className={`flex items-start space-x-3 p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? isStudent
                      ? 'border-impala-brown bg-impala-brown/5'
                      : 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  isSelected
                    ? isStudent
                      ? 'bg-impala-brown border-impala-brown'
                      : 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-impala-charcoal">{course.title}</p>
                  <p className="text-xs text-impala-charcoal-muted">
                    {course.category?.name || course.difficultyLevel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Registration Form (stepped) ──
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="card-white max-w-2xl w-full">
        {/* Back to role selection */}
        <button
          onClick={goBackToRole}
          className="text-sm text-impala-charcoal-muted hover:text-impala-charcoal mb-4 inline-flex items-center space-x-1"
        >
          <FontAwesomeIcon icon={faArrowRight} className="text-xs rotate-180" />
          <span>Change role</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
            isStudent ? 'bg-impala-brown/10 text-impala-brown' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <FontAwesomeIcon icon={isStudent ? faUserGraduate : faChalkboardTeacher} className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold font-display text-impala-charcoal">
            {isStudent ? 'Student Registration' : 'Teacher Registration'}
          </h2>
          <p className="text-impala-charcoal-muted text-sm">Fill in your details to get started</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step content */}
          {formStep === 'personal' && renderPersonalStep()}
          {formStep === 'interests' && renderInterestsStep()}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {formStep === 'personal' ? (
              <div />
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center space-x-1.5 text-sm font-medium text-impala-charcoal-muted hover:text-impala-charcoal transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                <span>Back</span>
              </button>
            )}

            {formStep === 'personal' ? (
              <button
                type="button"
                onClick={handleNext}
                className={`inline-flex items-center space-x-2 py-2.5 px-6 rounded-lg font-medium text-sm transition-colors ${
                  isStudent
                    ? 'bg-impala-brown text-white hover:bg-impala-brown-dark'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <span>Next</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center space-x-2 py-2.5 px-6 rounded-lg font-medium text-sm transition-colors ${
                  isStudent
                    ? 'bg-impala-brown text-white hover:bg-impala-brown-dark'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <>
                    <span>Create Account</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-impala-charcoal-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-impala-brown hover:text-impala-brown-dark font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
