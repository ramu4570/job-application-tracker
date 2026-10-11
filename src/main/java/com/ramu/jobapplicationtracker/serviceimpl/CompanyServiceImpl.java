package com.ramu.jobapplicationtracker.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ramu.jobapplicationtracker.model.Company;
import com.ramu.jobapplicationtracker.repo.CompanyRepository;
import com.ramu.jobapplicationtracker.service.CompanyService;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;


    @Override
    public Company createCompany(Company company) {

        return companyRepository.save(company);
    }


    @Override
    public List<Company> getAllCompanies() {

        return companyRepository.findAll();
    }


    @Override
    public Company getCompanyById(int id) {

        return companyRepository.findById(id).orElse(null);
    }


    @Override
    public Company updateCompany(int id, Company company) {

        Company oldCompany =
                companyRepository.findById(id).orElse(null);

        if (oldCompany != null) {

            oldCompany.setCompanyName(company.getCompanyName());

            oldCompany.setLocation(company.getLocation());

            oldCompany.setWebsite(company.getWebsite());

            oldCompany.setIndustry(company.getIndustry());

            return companyRepository.save(oldCompany);
        }

        return null;
    }


    @Override
    public void deleteCompany(int id) {

        companyRepository.deleteById(id);
    }
}


