import Role from '../../../server/queries/Role/Role'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })

    return
  }

  try {
    // console.log(req.query);
    let allRoles = await Role.Read.getAllRolesOfACompany()
    // allRoles.forEach(async (company, index) => {
    //   allCompanies[index]['OtherDetails'] = await Company.Read.getCompanyDetailsData(company.Co_ID)
    // })

    if (allRoles) {
      res.send({
        error: false,
        allRoles
      })
    }else{
      res.status(500).json({ error: 'failed to load data' })
    }
  } catch (e) {
    throw e
  }
}
