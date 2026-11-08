/**
 * Accessible 6-digit OTP input group — shared by login and OTR modals.
 */
export default function OtpDigitInputs({
  otpDigits,
  onDigitChange,
  onKeyDown,
  idPrefix = 'otp-digit',
  groupLabel = 'Enter 6-digit verification code',
  disabled = false,
  inputClassName = '',
}) {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="mt-4 flex min-w-0 justify-center gap-1.5 sm:gap-2"
    >
      {otpDigits.map((digit, index) => (
        <input
          key={index}
          id={`${idPrefix}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          aria-label={`Digit ${index + 1} of ${otpDigits.length}`}
          disabled={disabled}
          onChange={(event) => onDigitChange(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          className={inputClassName}
        />
      ))}
    </div>
  )
}
