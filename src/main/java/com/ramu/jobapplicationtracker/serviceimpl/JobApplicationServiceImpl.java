package com.ramu.jobapplicationtracker.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ramu.jobapplicationtracker.model.JobApplication;
import com.ramu.jobapplicationtracker.repo.JobApplicationRepository;
import com.ramu.jobapplicationtracker.service.JobApplicationService;

@Service
public class JobApplicationServiceImpl
        implements JobApplicationService {

    @Autowired
    private JobApplicationRepository repository;

    @Override
    public JobApplication createApplication(
            JobApplication application) {

        return repository.save(application);
    }

    @Override
    public List<JobApplication> getAllApplications() {

        return repository.findAll();
    }
    @Override
    public List<JobApplication> getApplicationsByUserName(String userName) {
        return repository.findByUserNameIgnoreCase(userName);
    }

    @Override
    public JobApplication getApplicationById(int id) {

        return repository.findById(id).orElse(null);
    }

    @Override
    public JobApplication updateApplication(
            int id,
            JobApplication application) {

        JobApplication oldApplication =
                repository.findById(id).orElse(null);

        if (oldApplication != null) {

            oldApplication.setJobTitle(application.getJobTitle());
            oldApplication.setJobType(application.getJobType());
            oldApplication.setLocation(application.getLocation());
            oldApplication.setSalary(application.getSalary());
            oldApplication.setApplicationDate(
                    application.getApplicationDate());
            oldApplication.setStatus(application.getStatus());
            oldApplication.setSource(application.getSource());
            oldApplication.setJobDescription(
                    application.getJobDescription());
            oldApplication.setNotes(application.getNotes());

            return repository.save(oldApplication);
        }

        return null;
    }

    @Override
    public void deleteApplication(int id) {

        repository.deleteById(id);
    }
}