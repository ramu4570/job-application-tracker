package com.ramu.jobapplicationtracker.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ramu.jobapplicationtracker.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Integer> {

}
