
import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'jobTrackerDemoApplications'
const USER_KEY = 'jobTrackerDemoUser'

const sampleApplications = [
  {
    applicationId: 1,
    companyName: 'Tesla',
    jobTitle: 'Software Engineer',
    jobType: 'Full-time',
    location: 'Germany',
    salary: '85000',
    applicationDate: '2026-10-01',
    status: 'Selected',
    source: 'LinkedIn',
    jobDescription: 'Software development opportunity.',
    notes: 'Sample demo application'
  },
  {
    applicationId: 2,
    companyName: 'Infosys',
    jobTitle: 'Java Developer',
    jobType: 'Full-time',
    location: 'Hyderabad',
    salary: '600000',
    applicationDate: '2026-10-04',
    status: 'Interview',
    source: 'Company Website',
    jobDescription: 'Java and Spring Boot development.',
    notes: 'Prepare for the technical interview'
  },
  {
    applicationId: 3,
    companyName: 'TCS',
    jobTitle: 'Junior Software Developer',
    jobType: 'Full-time',
    location: 'Bangalore',
    salary: '500000',
    applicationDate: '2026-10-08',
    status: 'Applied',
    source: 'Naukri',
    jobDescription: 'Entry-level software developer role.',
    notes: 'Waiting for a response'
  }
]

function getInitialApplications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved !== null) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Could not load demo applications:', error)
  }

  return sampleApplications
}

const emptyForm = {
  companyName: '',
  jobTitle: '',
  jobType: 'Full-time',
  location: '',
  salary: '',
  applicationDate: new Date().toLocaleDateString('en-CA'),
  status: 'Applied',
  source: '',
  jobDescription: '',
  notes: ''
}

function App() {
  const [applications, setApplications] = useState(getInitialApplications)
  const [activeUserName, setActiveUserName] = useState(
    () => localStorage.getItem(USER_KEY) || ''
  )
  const [profileName, setProfileName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ ...emptyForm })
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    } catch (err) {
      setError('Unable to save data in this browser.')
    }
  }, [applications])

  const totalApplications = applications.length

  const interviewCount = applications.filter(
    app => app.status === 'Interview'
  ).length

  const selectedCount = applications.filter(
    app => app.status === 'Selected'
  ).length

  const rejectedCount = applications.filter(
    app => app.status === 'Rejected'
  ).length

  const filteredApplications = applications.filter(app => {
    const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter

    const search = searchTerm.trim().toLowerCase()

    const matchesSearch =
      !search ||
      app.companyName.toLowerCase().includes(search) ||
      app.jobTitle.toLowerCase().includes(search) ||
      app.location.toLowerCase().includes(search)

    return matchesStatus && matchesSearch
  })

  function handleProfileSubmit(event) {
    event.preventDefault()

    const name = profileName.trim()

    if (!name) return

    setActiveUserName(name)
    localStorage.setItem(USER_KEY, name)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const companyName = formData.companyName.trim()
    const jobTitle = formData.jobTitle.trim()

    if (!companyName || !jobTitle) {
      setError('Please enter both the company name and job title.')
      return
    }

    const application = {
      ...formData,
      companyName,
      jobTitle,
      salary: formData.salary,
      applicationId: editingId ?? Date.now()
    }

    if (editingId !== null) {
      setApplications(previous =>
        previous.map(item =>
          item.applicationId === editingId ? application : item
        )
      )
    } else {
      setApplications(previous => [application, ...previous])
    }

    setFormData({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
  }

  function handleEdit(application) {
    setEditingId(application.applicationId)

    setFormData({
      ...emptyForm,
      ...application
    })

    setShowForm(true)
    setError('')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(applicationId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application?'
    )

    if (!confirmed) return

    setApplications(previous =>
      previous.filter(app => app.applicationId !== applicationId)
    )
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ ...emptyForm })
    setError('')
  }

  function handleLogout() {
    localStorage.removeItem(USER_KEY)
    setActiveUserName('')
    setProfileName('')
  }

  if (!activeUserName) {
    return (
      <main className="app">
        <section className="application-card welcome-card">
          <div className="welcome-icon">💼</div>

          <h1>Welcome to Job Application Tracker</h1>

          <p>
            Organize your job search, track opportunities, and
            manage your career journey in one place.
          </p>

          <form onSubmit={handleProfileSubmit} className="welcome-form">
            <label htmlFor="profileName">Your Name</label>

            <input
              id="profileName"
              type="text"
              value={profileName}
              onChange={event => setProfileName(event.target.value)}
              placeholder="Enter your name"
              required
            />

            <button type="submit">Continue to Dashboard →</button>
          </form>

          <p className="demo-notice">
            Demo mode · Sample applications included
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Job Application Tracker</h1>
          <p>
            Welcome, {activeUserName}! Keep your job search organized.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleLogout}
        >
          Change User
        </button>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🤝</span>
          <h3>Interviews</h3>
          <p>{interviewCount}</p>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🎉</span>
          <h3>Selected</h3>
          <p>{selectedCount}</p>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📌</span>
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="application-card">
        <div className="section-heading">
          <div>
            <h2>{editingId !== null ? 'Edit Application' : 'My Job Applications'}</h2>
            <p>Add a new opportunity or update an existing application.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                handleCancel()
              } else {
                setShowForm(true)
                setEditingId(null)
                setFormData({ ...emptyForm })
              }
            }}
          >
            {showForm ? 'Cancel' : '+ Add Job Application'}
          </button>
        </div>

        {showForm && (
          <form className="job-form" onSubmit={handleSubmit}>
            <h2>
              {editingId !== null ? 'Update Job Details' : 'Add New Application'}
            </h2>

            <label htmlFor="companyName">Company Name *</label>
            <input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. TCS, Infosys, Wipro"
              required
            />

            <label htmlFor="jobTitle">Job Title *</label>
            <input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Java Developer"
              required
            />

            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>

            <label htmlFor="location">Job Location</label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Hyderabad"
            />

            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              name="salary"
              type="number"
              min="0"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter salary"
            />

            <label htmlFor="applicationDate">Application Date *</label>
            <input
              id="applicationDate"
              name="applicationDate"
              type="date"
              value={formData.applicationDate}
              onChange={handleChange}
              required
            />

            <label htmlFor="status">Application Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Selected</option>
              <option>Rejected</option>
            </select>

            <label htmlFor="source">Job Source</label>
            <input
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="e.g. LinkedIn"
            />

            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Enter job description"
              rows="3"
            />

            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes or reminders"
              rows="3"
            />

            <div className="form-actions">
              <button type="submit">
                {editingId !== null ? 'Update Application' : 'Save Application'}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="applications-list">
        <div className="section-heading">
          <div>
            <h2>Saved Applications</h2>
            <p>Review and manage your opportunities.</p>
          </div>
          <span className="application-count">
            {filteredApplications.length} shown
          </span>
        </div>

        <div className="filter-bar">
          <div className="search-field">
            <label htmlFor="searchTerm">Search</label>
            <input
              id="searchTerm"
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Company, job title, or location"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="statusFilter">Filter by Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <option value="All">All Applications</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <span>🔎</span>
            <h3>No applications found</h3>
            <p>Try another search or add a new job application.</p>
          </div>
        ) : (
          <div className="saved-applications-grid">
            {filteredApplications.map(application => (
              <article
                className="saved-application"
                key={application.applicationId}
              >
                <div className="saved-application-heading">
                  <div>
                    <h3>{application.jobTitle}</h3>
                    <p className="company-name">{application.companyName}</p>
                  </div>

                  <span
                    className={`status-badge status-${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="application-details">
                  <p><strong>📍 Location:</strong> {application.location || 'Not specified'}</p>
                  <p><strong>💼 Type:</strong> {application.jobType}</p>
                  <p><strong>📅 Date:</strong> {application.applicationDate || 'Not specified'}</p>
                  <p><strong>💰 Salary:</strong> {application.salary ? Number(application.salary).toLocaleString() : 'Not specified'}</p>
                  {application.source && (
                    <p><strong>Source:</strong> {application.source}</p>
                  )}
                </div>

                {application.notes && (
                  <p className="application-notes">
                    <strong>Notes:</strong> {application.notes}
                  </p>
                )}

                <div className="application-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEdit(application)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(application.applicationId)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="demo-footer">
        Job Application Tracker · Browser demo mode
      </footer>
    </main>
  )
}

export default App
