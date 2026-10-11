import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4571";

function App() {
  const [companies, setCompanies] = useState([])
  const [applications, setApplications] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [profileName, setProfileName] = useState('')
  const [activeUserName, setActiveUserName] = useState('')


  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    applicationDate: '',
    status: '',
    source: '',
    jobDescription: '',
    notes: ''
  });
  // Dashboard statistics
  const totalApplications = applications.length

  const interviewCount = applications.filter(
    app => app.status?.toUpperCase() === 'INTERVIEW'
  ).length

  const selectedCount = applications.filter(
    app => app.status?.toUpperCase() === 'SELECTED'
  ).length

  const rejectedCount = applications.filter(
    app => app.status?.toUpperCase() === 'REJECTED'
  ).length

  // Filter applications by status
  const filteredApplications =
    statusFilter === 'All'
      ? applications
      : applications.filter(
          app => app.status?.toUpperCase() === statusFilter.toUpperCase()
        )

		useEffect(() => {
		  loadCompanies()
		}, [])

		useEffect(() => {
		  if (activeUserName) {
		    loadApplications()
		  }
		}, [activeUserName])


  async function loadCompanies() {
    try {
      const response = await fetch(`${API_URL}/companies`)

      if (!response.ok) {
        throw new Error('Unable to load companies.')
      }

      const data = await response.json()
      setCompanies(data)
    } catch (err) {
      setError(`Companies: ${err.message}`)
    }
  }

  async function loadApplications() {
    try {
      setLoading(true)

	  const response = await fetch(
	    `${API_URL}/applications/user/${encodeURIComponent(activeUserName)}`
	  )
      if (!response.ok) {
        throw new Error('Unable to load applications.')
      }

      const data = await response.json()
      setApplications(data)
    } catch (err) {
      setError(`Applications: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))
  }
  function handleProfileSubmit(event) {
    event.preventDefault()

    const name = profileName.trim()

    if (!name) {
      return
    }

    setActiveUserName(name)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const enteredCompanyName = formData.companyName.trim();

      if (!enteredCompanyName) {
        setError('Please enter a company name.');
        return;
      }

      // Find the company by name, ignoring uppercase/lowercase differences.
      let company = companies.find(
        item =>
          item.companyName?.trim().toLowerCase() ===
          enteredCompanyName.toLowerCase()
      );

      // Create the company if it does not already exist.
      if (!company) {
        const companyResponse = await fetch(`${API_URL}/companies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            companyName: enteredCompanyName
          })
        });

        if (!companyResponse.ok) {
          const message = await companyResponse.text();
          throw new Error(message || 'Failed to create company.');
        }

        company = await companyResponse.json();

        setCompanies(previous => [...previous, company]);
      }

      // Send the backend fields, including the company ID.
	  const applicationFields = { ...formData };
	  delete applicationFields.companyName;

	  const payload = {
	    ...applicationFields,
	    companyId: company.companyId,
	    userName: activeUserName,
	    salary: Number(formData.salary || 0)
	  };


      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/applications/${editingId}`
        : `${API_URL}/applications`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to save application.');
      }

      setFormData({
        companyName: '',
        jobTitle: '',
        jobType: '',
        location: '',
        salary: '',
        applicationDate: '',
        status: '',
        source: '',
        jobDescription: '',
        notes: ''
      });

      setEditingId(null);
      setShowForm(false);

      await loadApplications();

      alert(
        isEditing
          ? 'Application updated successfully!'
          : 'Job application saved successfully!'
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(application) {
    const company = companies.find(
      item => item.companyId === application.companyId
    );

    setEditingId(application.applicationId);

    setFormData({
      companyName: company?.companyName || '',
      jobTitle: application.jobTitle || '',
      jobType: application.jobType || 'Full-time',
      location: application.location || '',
      salary: String(application.salary ?? ''),
      applicationDate: application.applicationDate || '',
      status: application.status || 'Applied',
      source: application.source || '',
      jobDescription: application.jobDescription || '',
      notes: application.notes || ''
    });

    setShowForm(true);
  }


  async function handleDelete(applicationId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application?'
    )

    if (!confirmed) return

    try {
      setError('')

      const response = await fetch(
        `${API_URL}/applications/${applicationId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to delete application.')
      }

      await loadApplications()
      alert('Application deleted successfully!')
    } catch (err) {
      setError(err.message)
    }
  }
  if (!activeUserName) {
  	    return (
  	      <div className="app">
  	        <div className="application-card">
  	          <h1>Welcome to Job Application Tracker</h1>
  	          <p>Enter your name to view your job applications.</p>

			  <form onSubmit={handleProfileSubmit} className="welcome-form">
			    <label htmlFor="profileName">Your Name</label>

			    <input
			      id="profileName"
			      type="text"
			      value={profileName}
			      onChange={(event) => setProfileName(event.target.value)}
			      placeholder="Enter your name"
			      required
			    />

			    <button type="submit">Continue</button>
			  </form>
  	        </div>
  	      </div>
  	    )
  	  }


  return (
    <div className="app">
      <h1>Job Application Tracker</h1>
      <p>Manage and track your job applications in one place.</p>

	  <div className="dashboard-stats">
	    <div className="stat-card">
	      <h3>Total Applications</h3>
	      <p>{totalApplications}</p>
	    </div>

	    <div className="stat-card">
	      <h3>Interviews</h3>
	      <p>{interviewCount}</p>
	    </div>

	    <div className="stat-card">
	      <h3>Selected</h3>
	      <p>{selectedCount}</p>
	    </div>

	    <div className="stat-card">
	      <h3>Rejected</h3>
	      <p>{rejectedCount}</p>
	    </div>
	  </div>


      {error && <p className="error-message">{error}</p>}

      <div className="application-card">
        <h2>My Job Applications</h2>
        <p>Track your applications and their current status.</p>

        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Job Application'}
        </button>

        {showForm && (
          <form className="job-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Application' : 'Add New Application'}</h2>


		  <label htmlFor="companyName">Company Name</label>
		  <input
		    id="companyName"
		    name="companyName"
		    value={formData.companyName}
		    onChange={handleChange}
		    placeholder="e.g. TCS, Infosys, Wipro"
		    required
		  />

            <label htmlFor="jobTitle">Job Title</label>
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
              placeholder="e.g. Bangalore"
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

            <label htmlFor="applicationDate">Application Date</label>
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
              placeholder="Add notes"
              rows="3"
            />

			<button type="submit">
			  {editingId ? 'Update Application' : 'Save Application'}
			</button>
			</form>
        )}
      </div>

      <section className="applications-list">
        <h2>Saved Applications</h2>
		<label htmlFor="statusFilter">Filter by Status:</label>

		<select
		  id="statusFilter"
		  value={statusFilter}
		  onChange={(event) => setStatusFilter(event.target.value)}
		>
		  <option value="All">All Applications</option>
		  <option value="Applied">Applied</option>
		  <option value="Interview">Interview</option>
		  <option value="Selected">Selected</option>
		  <option value="Rejected">Rejected</option>
		</select>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No applications saved yet. Add your first application!</p>
        ) : (
			filteredApplications.map(application => {
			  const company = companies.find(
			    item => item.companyId === application.companyId
			  )
            return (
              <article
                className="saved-application"
                key={application.applicationId}
              >
			    <p><strong>Job Title:</strong> {application.jobTitle || 'Not specified'}</p>
                <p><strong>Company:</strong> {company?.companyName || `Company #${application.companyId}`}</p>
                <p><strong>Location:</strong> {application.location || 'Not specified'}</p>
                <p><strong>Type:</strong> {application.jobType || 'Not specified'}</p>
                <p><strong>Date:</strong> {application.applicationDate || 'Not specified'}</p>
                <p><strong>Status:</strong> {application                .status || 'Not specified'}</p>

				<div className="application-actions">
				  <button
				    type="button"
				    onClick={() => handleEdit(application)}
				  >
				    Edit
				  </button>

				  <button
				    type="button"
				    onClick={() => handleDelete(application.applicationId)}
				  >
				    Delete
				  </button>
				</div>

              </article>
            )
          })
        )}
      </section>
    </div>
  )
}

export default App
