const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const formatDateTime = (isoDate: string) =>
  dateTimeFormat.format(new Date(isoDate))
