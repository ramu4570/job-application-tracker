package com.ramu.jobapplicationtracker.service;

import java.util.List;

import com.ramu.jobapplicationtracker.model.JobApplication;

public interface JobApplicationService {

    JobApplication createApplication(JobApplication application);

    List<JobApplication> getAllApplications();

    List<JobApplication> getApplicationsByUserName(String userName);

    JobApplication getApplicationById(int id);

    JobApplication updateApplication(int id, JobApplication application);

    void deleteApplication(int id);
}