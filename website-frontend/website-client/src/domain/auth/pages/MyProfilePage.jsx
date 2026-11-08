import { User, Briefcase, Shield, KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AccountHeader from '@/shared/components/common/Header/AccountHeader'
import { BackButton } from '@/shared/components/buttons'
import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import ReadOnlyField from '@/shared/components/forms/ReadOnlyField'
import PageCardSkeleton from '@/shared/components/skeleton/PageCardSkeleton'
import MainLayout from '@/shared/layouts/MainLayout/MainLayout'
import ModulePageShell from '@/shared/layouts/ModulePageShell'
import { MODULE_MAIN_CLASS } from '@/shared/constants/moduleContentStyles'
import ProfileAccountsSection from '@/domain/auth/components/ProfileAccountsSection'
import { useMyProfile } from '../hooks/useMyProfile'
import { useProfileBackNavigation } from '../hooks/useProfileBackNavigation'
import {
  formatProfileDomain,
  profileDesignation,
  profileDisplayName,
  profileInitials,
  profileLoginId,
} from '../utils/profileDisplay'

const fieldGridClass = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

function hasText(value) {
  return Boolean(String(value ?? '').trim())
}

function ProfileHero({ user }) {
  const { t } = useTranslation()
  const name = profileDisplayName(user)
  const designation = profileDesignation(user)
  const organization = user?.hierarchyName

  return (
    <div className="mb-5 flex flex-col items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#01458e] text-lg font-bold text-white"
        aria-hidden
      >
        {profileInitials(user)}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="m-0 truncate text-lg font-semibold text-slate-900">{name || '—'}</h2>
        {designation ? (
          <p className="m-0 mt-1 text-sm font-medium text-slate-600">{designation}</p>
        ) : null}
        {organization ? (
          <p className="m-0 mt-1 text-sm text-slate-600">{organization}</p>
        ) : null}
        {user?.role ? (
          <p className="m-0 mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            {user.role}
          </p>
        ) : null}
        <p className="m-0 mt-2 text-xs text-slate-500">{t('profile.readOnlyHint')}</p>
      </div>
    </div>
  )
}

export default function MyProfilePage() {
  const { t } = useTranslation()
  const { profile, isLoading, loadError } = useMyProfile()
  const goBackFromProfile = useProfileBackNavigation()

  const backAction = (
    <BackButton type="button" onClick={goBackFromProfile}>
      {t('profile.back')}
    </BackButton>
  )

  const domainLabel = formatProfileDomain(profile.domain)
  const showRolesSection =
    hasText(profile.role) || hasText(profile.designation) || hasText(domainLabel)

  return (
    <MainLayout
      header={<AccountHeader />}
      beforeMain={
        <div className="h-[5px] shrink-0 bg-dashboard-nav" aria-hidden="true" />
      }
      mainClassName={MODULE_MAIN_CLASS}
    >
      {isLoading ? (
        <ModulePageShell title={t('profile.title')} actions={backAction}>
          <PageCardSkeleton variant="profile" message={t('profile.loading')} />
        </ModulePageShell>
      ) : (
        <ModulePageShell
          title={t('profile.title')}
          subtitle={t('profile.subtitle')}
          actions={backAction}
        >
          {loadError ? (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {loadError}
            </div>
          ) : null}

          <ProfileHero user={profile} />

          <div className="flex flex-col gap-5">
            <FormProfileSection icon={User} title={t('profile.sections.personal')}>
              <div className={fieldGridClass}>
                <ReadOnlyField label={t('profile.fields.displayName')} value={profileDisplayName(profile)} />
                <ReadOnlyField label={t('profile.fields.firstName')} value={profile.firstName} />
                <ReadOnlyField label={t('profile.fields.lastName')} value={profile.lastName} />
                <ReadOnlyField label={t('profile.fields.username')} value={profile.username} showLock />
                <ReadOnlyField label={t('profile.fields.userId')} value={profile.userIdMask} showLock />
                <ReadOnlyField label={t('profile.fields.loginId')} value={profileLoginId(profile)} />
                <ReadOnlyField label={t('profile.fields.email')} value={profile.email} />
                <ReadOnlyField label={t('profile.fields.mobile')} value={profile.mobile} />
                {domainLabel ? (
                  <ReadOnlyField label={t('profile.fields.userDomain')} value={domainLabel} showLock />
                ) : null}
              </div>
            </FormProfileSection>

            <FormProfileSection icon={Briefcase} title={t('profile.sections.posting')}>
              <div className={fieldGridClass}>
                <ReadOnlyField label={t('profile.fields.designation')} value={profileDesignation(profile)} />
                <ReadOnlyField label={t('profile.fields.postingName')} value={profile.postingName} />
                <ReadOnlyField label={t('profile.fields.hierarchyName')} value={profile.hierarchyName} />
                <ReadOnlyField label={t('profile.fields.hierarchyCode')} value={profile.hierarchyCode} />
                {hasText(profile.seatUserAllotId) ? (
                  <ReadOnlyField
                    label={t('profile.fields.seatAllotId')}
                    value={profile.seatUserAllotId}
                    showLock
                  />
                ) : null}
              </div>
            </FormProfileSection>

            <ProfileAccountsSection user={profile} />

            {showRolesSection ? (
              <FormProfileSection icon={KeyRound} title={t('profile.sections.roles')}>
                <div className={fieldGridClass}>
                  <ReadOnlyField label={t('profile.fields.role')} value={profile.role} showLock />
                  <ReadOnlyField
                    label={t('profile.fields.designation')}
                    value={profileDesignation(profile)}
                    showLock
                  />
                  {domainLabel ? (
                    <ReadOnlyField
                      label={t('profile.fields.userDomain')}
                      value={domainLabel}
                      showLock
                    />
                  ) : null}
                </div>
                <p className="m-0 mt-3 text-xs text-slate-500">{t('profile.rolesReadOnlyNote')}</p>
              </FormProfileSection>
            ) : null}

            <FormProfileSection icon={Shield} title={t('profile.sections.security')}>
              <p className="m-0 text-sm text-slate-600">{t('profile.securityAvailability')}</p>
            </FormProfileSection>
          </div>
        </ModulePageShell>
      )}
    </MainLayout>
  )
}
