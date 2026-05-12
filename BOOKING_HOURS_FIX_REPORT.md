# BOOKING HOURS FIX

Updated Arabic booking form rules:
- Available times only from 15:00 to 22:00.
- Friday is blocked.
- Form submission is prevented outside working hours.
- Time input now has min/max/step attributes.
- User gets Arabic alerts if choosing an invalid date/time.

Test:
- Open homepage
- Click احجز تقييم
- Try Friday: should be rejected
- Try 12:00 or 23:00: should be rejected
- Try 15:00 to 22:00 Saturday-Thursday: should submit to WhatsApp
