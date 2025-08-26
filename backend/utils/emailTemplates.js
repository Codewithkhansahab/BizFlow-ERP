// Utility to build rich, responsive(ish) HTML emails with inline styles
// Add more templates as needed

export function buildRegistrationEmail({
  name,
  role,
  approvalStatus,
  approvalRequiredRole,
  frontendUrl = 'https://bizflow-erp-1.onrender.com',
  appName = 'Bizflow',
  supportEmail,
  logoUrl,
}) {
  const isPending = approvalStatus === 'Pending';
  const primaryColor = '#4f46e5';
  const textColor = '#111827';
  const mutedText = '#6b7280';
  const bgColor = '#f3f4f6';
  const cardBg = '#ffffff';

  const ctaUrl = `${frontendUrl}/login`;
  const subject = isPending
    ? `${appName}: ${role} registration received`
    : `${appName}: Welcome, ${name}! Your ${role} account is ready`;

  const text = isPending
    ? `Hi ${name},\n\nThanks for registering as ${role} on ${appName}. Your request is pending ${approvalRequiredRole} approval. We'll notify you as soon as it's reviewed. You can sign in anytime to check your status: ${ctaUrl}.\n\nIf you have questions, reply to this email${supportEmail ? ` (${supportEmail})` : ''}.\n\n— The ${appName} Team`
    : `Hi ${name},\n\nWelcome to ${appName}! Your ${role} account is all set. Click here to sign in: ${ctaUrl}.\n\nIf you have questions, reply to this email${supportEmail ? ` (${supportEmail})` : ''}.\n\n— The ${appName} Team`;

  const statusBadge = isPending
    ? `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#FEF3C7;color:#92400E;font-weight:600;font-size:12px;border:1px solid #F59E0B;">Pending ${approvalRequiredRole} approval</span>`
    : `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#DCFCE7;color:#065F46;font-weight:600;font-size:12px;border:1px solid #10B981;">Approved</span>`;

  const headerBrand = logoUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;"><tr>
         <td style="vertical-align:middle;"><img src="${logoUrl}" alt="${appName}" width="120" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:120px;" /></td>
         <td style="vertical-align:middle;padding-left:10px;"><div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div></td>
       </tr></table>`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div>`;

  const html = `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${bgColor};padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:${cardBg};border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:24px 28px;background:#ffffff;border-bottom:1px solid #e5e7eb;" align="left">
              ${headerBrand}
              <div style="font-size:12px;color:${mutedText}">${new Date().toLocaleDateString()}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;" align="left">
              <h1 style="margin:0 0 8px 0;color:${textColor};font-size:22px;line-height:1.3;">Hi ${name},</h1>
              <p style="margin:0 0 14px 0;color:${mutedText};font-size:15px;line-height:1.6;">
                ${isPending
                  ? `Thanks for registering as <strong>${role}</strong> on ${appName}. Your request is currently awaiting <strong>${approvalRequiredRole}</strong> approval.`
                  : `Welcome to <strong>${appName}</strong>! Your <strong>${role}</strong> account has been created successfully.`}
              </p>
              <div style="margin:12px 0 20px 0;">${statusBadge}</div>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 18px 0 24px 0;">
                <tr>
                  <td align="center" bgcolor="${primaryColor}" style="border-radius:8px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;background:${primaryColor};border-radius:8px;">${isPending ? 'View account' : 'Sign in to your account'}</a>
                  </td>
                </tr>
              </table>

              <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;background:#fafafa;color:${mutedText};font-size:13px;">
                <div style="font-weight:700;color:${textColor};margin-bottom:6px;">Registration details</div>
                <div><strong>Role:</strong> ${role}</div>
                <div><strong>Status:</strong> ${isPending ? `Pending ${approvalRequiredRole} approval` : 'Approved'}</div>
              </div>

              <p style="margin:20px 0 0 0;color:${mutedText};font-size:13px;line-height:1.6;">
                ${isPending
                  ? `We'll notify you by email as soon as your request is reviewed.`
                  : `You're all set! Explore your dashboard and start using ${appName}.`}
              </p>

              <p style="margin:12px 0 0 0;color:${mutedText};font-size:13px;line-height:1.6;">
                Need help? Just reply to this email${supportEmail ? ` or contact us at <a href=\"mailto:${supportEmail}\" style=\"color:${primaryColor};text-decoration:none;\">${supportEmail}</a>` : ''}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#ffffff;border-top:1px solid #e5e7eb;" align="left">
              <div style="color:${mutedText};font-size:12px;">
                You received this email because you registered on ${appName}. If this wasn't you, please ignore this email.
              </div>
            </td>
          </tr>
        </table>
        <div style="color:${mutedText};font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </td>
    </tr>
  </table>
  `;

  return { subject, html, text };
}

export function buildOTPEmail({
  name = 'there',
  purpose = 'Verification',
  otp,
  expiresInText = '15 minutes',
  frontendUrl = 'https://bizflow-erp-1.onrender.com',
  appName = 'Bizflow',
  supportEmail,
  logoUrl,
}) {
  const primaryColor = '#4f46e5';
  const textColor = '#111827';
  const mutedText = '#6b7280';
  const bgColor = '#f3f4f6';
  const cardBg = '#ffffff';

  const ctaUrl = `${frontendUrl}/login`;
  const subject = `${appName}: ${purpose} OTP`;
  const text = `Hi ${name},\n\nYour ${purpose.toLowerCase()} OTP is: ${otp}.\nThis code expires in ${expiresInText}.\n\nOpen ${appName}: ${ctaUrl}\n\n— The ${appName} Team`;

  const headerBrand = logoUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;"><tr>
         <td style="vertical-align:middle;"><img src="${logoUrl}" alt="${appName}" width="120" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:120px;" /></td>
         <td style="vertical-align:middle;padding-left:10px;"><div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div></td>
       </tr></table>`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div>`;

  const html = `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${bgColor};padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:${cardBg};border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:24px 28px;background:#ffffff;border-bottom:1px solid #e5e7eb;" align="left">
              ${headerBrand}
              <div style="font-size:12px;color:${mutedText}">${new Date().toLocaleDateString()}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;" align="left">
              <h1 style="margin:0 0 8px 0;color:${textColor};font-size:22px;line-height:1.3;">Hi ${name},</h1>
              <p style="margin:0 0 14px 0;color:${mutedText};font-size:15px;line-height:1.6;">Use the OTP below to complete your ${purpose.toLowerCase()}.</p>
              <div style="margin:12px 0 16px 0;padding:14px 16px;border:2px dashed #c7d2fe;border-radius:10px;background:#eef2ff;color:${textColor};font-size:18px;font-weight:800;letter-spacing:2px;text-align:center;">${otp}</div>
              <p style="margin:0 0 18px 0;color:${mutedText};font-size:13px;">This code expires in <strong>${expiresInText}</strong>. Do not share it with anyone.</p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 10px 0 24px 0;">
                <tr>
                  <td align="center" bgcolor="${primaryColor}" style="border-radius:8px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;background:${primaryColor};border-radius:8px;">Open ${appName}</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:${mutedText};font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
        <div style="color:${mutedText};font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </td>
    </tr>
  </table>`;

  return { subject, html, text };
}

export function buildPasswordResetLinkEmail({
  name = 'there',
  resetUrl,
  frontendUrl = 'https://bizflow-erp-1.onrender.com',
  appName = 'Bizflow',
  supportEmail,
  logoUrl,
}) {
  const primaryColor = '#4f46e5';
  const textColor = '#111827';
  const mutedText = '#6b7280';
  const bgColor = '#f3f4f6';
  const cardBg = '#ffffff';

  const subject = `${appName}: Password Reset Request`;
  const text = `Hi ${name},\n\nYou requested a password reset. Click the link to set a new password: ${resetUrl}\n\nIf you didn't request this, ignore this email.\n\n— The ${appName} Team`;

  const headerBrand = logoUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;"><tr>
         <td style="vertical-align:middle;"><img src="${logoUrl}" alt="${appName}" width="120" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:120px;" /></td>
         <td style="vertical-align:middle;padding-left:10px;"><div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div></td>
       </tr></table>`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div>`;

  const html = `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${bgColor};padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:${cardBg};border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:24px 28px;background:#ffffff;border-bottom:1px solid #e5e7eb;" align="left">
              ${headerBrand}
              <div style="font-size:12px;color:${mutedText}">${new Date().toLocaleDateString()}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;" align="left">
              <h1 style="margin:0 0 8px 0;color:${textColor};font-size:22px;line-height:1.3;">Password reset request</h1>
              <p style="margin:0 0 14px 0;color:${mutedText};font-size:15px;line-height:1.6;">Click the button below to set a new password. This link expires in 1 hour.</p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 10px 0 24px 0;">
                <tr>
                  <td align="center" bgcolor="${primaryColor}" style="border-radius:8px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;background:${primaryColor};border-radius:8px;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:${mutedText};font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
        <div style="color:${mutedText};font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </td>
    </tr>
  </table>`;

  return { subject, html, text };
}

export function buildPasswordChangedEmail({
  name = 'there',
  frontendUrl = 'https://bizflow-erp-1.onrender.com',
  appName = 'Bizflow',
  supportEmail,
  logoUrl,
}) {
  const primaryColor = '#4f46e5';
  const textColor = '#111827';
  const mutedText = '#6b7280';
  const bgColor = '#f3f4f6';
  const cardBg = '#ffffff';

  const ctaUrl = `${frontendUrl}/login`;
  const subject = `${appName}: Password Changed Successfully`;
  const text = `Hi ${name},\n\nYour password has been updated. If this wasn't you, please secure your account immediately.\n\nSign in: ${ctaUrl}\n\n— The ${appName} Team`;

  const headerBrand = logoUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;"><tr>
         <td style="vertical-align:middle;"><img src="${logoUrl}" alt="${appName}" width="120" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:120px;" /></td>
         <td style="vertical-align:middle;padding-left:10px;"><div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div></td>
       </tr></table>`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div>`;

  const html = `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${bgColor};padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:${cardBg};border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:24px 28px;background:#ffffff;border-bottom:1px solid #e5e7eb;" align="left">
              ${headerBrand}
              <div style="font-size:12px;color:${mutedText}">${new Date().toLocaleDateString()}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;" align="left">
              <h1 style="margin:0 0 8px 0;color:${textColor};font-size:22px;line-height:1.3;">Password updated</h1>
              <p style="margin:0 0 14px 0;color:${mutedText};font-size:15px;line-height:1.6;">Your password has been changed successfully.</p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 10px 0 24px 0;">
                <tr>
                  <td align="center" bgcolor="${primaryColor}" style="border-radius:8px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;background:${primaryColor};border-radius:8px;">Sign in</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:${mutedText};font-size:12px;">If you didn't make this change, please contact support immediately.</p>
            </td>
          </tr>
        </table>
        <div style="color:${mutedText};font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </td>
    </tr>
  </table>`;

  return { subject, html, text };
}

export function buildApprovalDecisionEmail({
  name = 'there',
  role,
  decision = 'Approved', // 'Approved' | 'Rejected'
  reason,
  frontendUrl = 'https://bizflow-erp-1.onrender.com',
  appName = 'Bizflow',
  supportEmail,
  logoUrl,
}) {
  const isApproved = decision === 'Approved';
  const primaryColor = '#4f46e5';
  const textColor = '#111827';
  const mutedText = '#6b7280';
  const bgColor = '#f3f4f6';
  const cardBg = '#ffffff';

  const ctaUrl = `${frontendUrl}/login`;
  const subject = isApproved
    ? `${appName}: Your ${role} registration is approved`
    : `${appName}: Your ${role} registration was rejected`;

  const text = isApproved
    ? `Hi ${name},\n\nGood news! Your ${role} registration has been approved. You can now sign in: ${ctaUrl}.\n\n— The ${appName} Team`
    : `Hi ${name},\n\nWe’re sorry—your ${role} registration was rejected.${reason ? ` Reason: ${reason}` : ''}\n\nIf you believe this is a mistake, please reply to this email${supportEmail ? ` (${supportEmail})` : ''}.\n\n— The ${appName} Team`;

  const statusBadge = isApproved
    ? `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#DCFCE7;color:#065F46;font-weight:600;font-size:12px;border:1px solid #10B981;">Approved</span>`
    : `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#FEE2E2;color:#991B1B;font-weight:600;font-size:12px;border:1px solid #EF4444;">Rejected</span>`;

  const headerBrand = logoUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;"><tr>
         <td style="vertical-align:middle;"><img src="${logoUrl}" alt="${appName}" width="120" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:120px;" /></td>
         <td style="vertical-align:middle;padding-left:10px;"><div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div></td>
       </tr></table>`
    : `<div style="font-size:22px;font-weight:800;letter-spacing:0.2px;color:${primaryColor}">${appName}</div>`;

  const html = `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${bgColor};padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:${cardBg};border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:24px 28px;background:#ffffff;border-bottom:1px solid #e5e7eb;" align="left">
              ${headerBrand}
              <div style="font-size:12px;color:${mutedText}">${new Date().toLocaleDateString()}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;" align="left">
              <h1 style="margin:0 0 8px 0;color:${textColor};font-size:22px;line-height:1.3;">${isApproved ? 'Registration approved' : 'Registration rejected'}</h1>
              <div style="margin:12px 0 16px 0;">${statusBadge}</div>
              <p style="margin:0 0 14px 0;color:${mutedText};font-size:15px;line-height:1.6;">
                ${isApproved
                  ? `Your <strong>${role}</strong> account is now active. You can sign in to get started.`
                  : `Your registration for the <strong>${role}</strong> role was not approved.${reason ? ` Reason: <em>${reason}</em>.` : ''}`}
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 10px 0 24px 0;">
                <tr>
                  <td align="center" bgcolor="${primaryColor}" style="border-radius:8px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;background:${primaryColor};border-radius:8px;">${isApproved ? 'Sign in' : 'Open portal'}</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:${mutedText};font-size:12px;">Need help? Reply to this email${supportEmail ? ` or contact <a href=\"mailto:${supportEmail}\" style=\"color:${primaryColor};text-decoration:none;\">${supportEmail}</a>` : ''}.</p>
            </td>
          </tr>
        </table>
        <div style="color:${mutedText};font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </td>
    </tr>
  </table>`;

  return { subject, html, text };
}
