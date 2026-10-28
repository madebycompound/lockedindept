Supabase email templates for Locked In Dept.

Where: Supabase > Authentication > Emails (or "Email Templates").
For each template, set the Subject and paste the matching file into the Body (source/HTML view):

  Invite user      subject: You're in. Welcome to Club Locked In   body: invite.html
  Magic Link       subject: Your Locked In Dept. sign-in link       body: magic-link.html
  Confirm sign up  subject: Confirm your Locked In Dept. email      body: confirm.html
  Change Email     subject: Confirm your new email                  body: change-email.html

Leave the {{ .ConfirmationURL }} tags exactly as they are; Supabase fills them in.
