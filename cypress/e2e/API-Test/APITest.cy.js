import { UserAPIPage } from "../../support/Pages/UserAPI.Page";
import { PetAPIPage } from "../../support/Pages/PetAPI.Page";
import { PetCounter } from '../../support/utils/PetCounter';


describe('API Tests - User and Pet', () => {
  const baseUrl = 'https://petstore.swagger.io/v2'; 
  let userAPI = new UserAPIPage(baseUrl); 
  let petAPI = new PetAPIPage(baseUrl); 

  const userInfo = {
    id : 123,
    firstname : 'NelaTest',
    username: 'NelaPrueba1',
    password: "password123",
    email : "test@test.com",
    phone: "123456",
    userStatus: 0
  };
  
  before ('login', () => {
    userAPI.userLogIn('user1', 'user1').then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.include('logged in user session:');
    });
  });

  it('Create a user correctly', () => {
    userAPI.createUser(userInfo).then(response => {
      expect(response.status).to.eq(200);
      expect(response.statusText).to.eq('OK');
    });
  });

  it('Get the created user´s details', () =>{
    userAPI.getUser(userInfo.username).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.username).to.eq(userInfo.username);
      expect(response.body.password).to.eq(userInfo.password);
      expect(response.body.userStatus).to.eq(0);
    });
  })

  it('Delete the created user', () =>{
    userAPI.getUser(userInfo.username).then(response => {
      expect(response.status).to.eq(200);
    });
  })

  it('Get Sold Pets and verify', () => {
    petAPI.getPetByStatus('sold').then(soldPets => {
      cy.log(soldPets)
      expect(soldPets).to.be.an('array');
      soldPets.forEach(pet => {
        expect(pet.status).to.eq('sold');
      });
    });
  });

  it('Count repeated pet names by status', () => {
    petAPI.getPetByStatus('sold').then(pets => {
      const petCounter = new PetCounter(pets);
      const nameCounts = petCounter.countPetNames();
      for (const [name, count] of Object.entries(nameCounts)) {
        console.log(`Name: ${name}, Count: ${count}`);
      }
    })
  })
});
