export default async (__, args, cxt) => {
  try {
    const sections = await cxt.section.getSections()
    return sections
  } catch (e) {
    console.log('error => ', e)
    return null
  }
}
