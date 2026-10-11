package com.ramu.jobapplicationtracker.service;

import java.util.List;

import com.ramu.jobapplicationtracker.model.Company;

public interface CompanyService {

    Company createCompany(Company company);

    List<Company> getAllCompanies();

    Company getCompanyById(int id);

    Company updateCompany(int id, Company company);

    void deleteCompany(int id);
}


