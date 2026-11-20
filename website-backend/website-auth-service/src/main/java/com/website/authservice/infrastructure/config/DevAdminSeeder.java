package com.website.authservice.infrastructure.config;

import com.website.authservice.domain.entity.AdminUser;
import com.website.authservice.domain.entity.AdminRole;
import com.website.authservice.domain.repository.AdminRoleRepository;
import com.website.authservice.domain.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Component
@Profile("!test")
public class DevAdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevAdminSeeder.class);

    private final AdminUserRepository adminUserRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public DevAdminSeeder(
            AdminUserRepository adminUserRepository,
            AdminRoleRepository adminRoleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.adminUserRepository = adminUserRepository;
        this.adminRoleRepository = adminRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String username = System.getenv("WEBSITE_DEV_ADMIN_USERNAME");
        String password = System.getenv("WEBSITE_DEV_ADMIN_PASSWORD");
        if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
            log.info(
                    "Skipping CMS admin seed; set WEBSITE_DEV_ADMIN_USERNAME and WEBSITE_DEV_ADMIN_PASSWORD to create the first admin."
            );
            return;
        }
        String normalizedUsername = username.trim();
        if (adminUserRepository.findByUsernameIgnoreCase(normalizedUsername).isPresent()) {
            return;
        }
        AdminUser admin = new AdminUser();
        admin.setId(UUID.randomUUID());
        admin.setUsername(normalizedUsername);
        admin.setDisplayName(System.getenv().getOrDefault("WEBSITE_DEV_ADMIN_DISPLAY_NAME", "KRAN Admin"));
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setActive(true);
        admin.setSystemAdmin(true);
        adminRoleRepository.findByCodeIgnoreCase("SYSTEM_ADMIN")
                .map(AdminRole::getId)
                .ifPresent(admin::setRoleId);
        adminUserRepository.save(admin);
        log.info("Seeded CMS admin user '{}'", normalizedUsername);
    }
}
