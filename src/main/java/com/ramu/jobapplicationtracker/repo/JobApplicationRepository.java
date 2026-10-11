package com.ramu.jobapplicationtracker.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ramu.jobapplicationtracker.model.JobApplication;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Integer> {

    List<JobApplication> findByUserNameIgnoreCase(String userName);

}
