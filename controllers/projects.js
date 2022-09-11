exports.getProjects = (req, res, next) => {
    const projects = ['Project 1', 'Project 2'];
    console.log('here');
    return res.status(200).json({message: 'Fetched projects successfully.', projects: projects});
};