module.exports = async (__, args, cxt) => {
  try {
    const id = args.id
    const project = await cxt.project.getProjectById(id)
    return project
  } catch (e) {
    console.log("Error => ", e)
    return null
  }
}
