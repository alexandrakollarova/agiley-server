module.exports = async (__, args, cxt) => {
  try {
    const ids = args.ids
    const sections = await cxt.section.getSectionsById(ids)
    return sections
  } catch (e) {
    console.log("Error => ", e)
    return null
  }
}
