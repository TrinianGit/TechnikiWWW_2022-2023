import '../css/App.css';
import React from 'react'
import axios from "axios";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import sha256 from 'crypto-js/sha256';

function About() {

  function equalTo(ref, msg) {
    return this.test({
      name: 'equalTo',
      exclusive: false,
      message: msg || 'Hasła muszą być identyczne',
      params: {
        reference: ref.path
      },
      test: function(value) {
        return value === this.resolve(ref) 
      }
    })
  };
  
  Yup.addMethod(Yup.string, 'equalTo', equalTo);




  const validationSchemaLogin = Yup.object().shape({
    Login: Yup.string().required("Nazwa użytkownika nie może być pusta"),
    Password: Yup.string().required("Hasło nie może być puste"),
  });

  const initialValuesLogin = {
    Login: "",
    Password: ""
  };

  const onSubmitLogin = (data) => {

    
    axios.get("http://localhost:3001/logins", {
      params: {
        Login : data['Login'],
        Password: sha256(data['Password']).toString(),
      }
    }).then((response) => {
      if (response['data'] == "Not found Login" || response['data'] == "Wrong Password"){
        Array.from(document.getElementsByClassName("log-in")).forEach(function(form) {
          form.getElementsByClassName("Error").item(0).innerHTML = "Niepoprawna nazwa użytkownika lub hasło";
        });
      }
      else {
        sessionStorage.setItem("accessToken", response["data"]);
        sessionStorage.setItem("Username", data["Login"]);
        window.location.reload();
      }
      console.log(response);
    }).catch((error) => {
      console.error(error);
    });
  };

  const validationSchemaRegister = Yup.object().shape({
    Login: Yup.string().required("Nazwa użytkownika nie może być pusta"),
    Email: Yup.string().email("Niepoprawny format adresu email").required("Email nie może być pusty"),
    Password: Yup.string().required("Hasło nie może być puste"),
    RepeatPassword: Yup.string().required("Powtórz hasło").equalTo(Yup.ref('Password'))
  });

  const initialValuesRegister = {
    Login: "",
    Email: "",
    Password: "",
    RepeatPassword: ""
  };

  const onSubmitRegister = async(data) => {

    await axios.post('http://localhost:3001/user',null, {
      params: {
        U: data['Login'],
        E: data['Email'],
        FLAG: "create"
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    await axios.post('http://localhost:3001/logins',null, {
      params: {
        Login: data['Login'],
        Password: sha256(data['Password']).toString(),
        Flag: "Create"
      }
    })
    .then(function (response) {
      if (response['data'] != "User created"){
        Array.from(document.getElementsByClassName("register")).forEach(function(form) {
          form.getElementsByClassName("Error").item(0).innerHTML = "Użytkownik o podanej nazwie już istnieje";
        });
      }
      else {
        window.location.reload();
      }
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  let navbar;
  if(sessionStorage.getItem("accessToken") != null){
    navbar =
            <div className="text-center me-4">
              <div className="nav-item dropdown nav-user">
                <a className="nav-link nav-user-img" href="#" id="navbarDropdownMenuLink2" data-bs-toggle="dropdown">
                  <i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 532 532" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <circle cx="270.75986" cy="260.93427" r="86.34897" fill="#ffb6b6"/>
                      <polygon points="221.18982 360.05209 217.28876 320.6185 295.18982 306.05209 341.18982 418.05209 261.18982 510.05209 204.18982 398.05209 221.18982 360.05209" fill="#ffb6b6"/>
                      <path d="m216.0374,340.35736l17.03111,3.84802s-13.38821-42.45453-8.84396-46.50766c4.54427-4.05316,15.68007,2.33328,15.68007,2.33328l11.70201,13.1199,14.25394-14.51239s15.47495-19.2421,21.53397-24.6463-3.67319-25.46364-3.67319-25.46364c0,0,89.89185-24.23923,56.44299-67.83968,0,0-19.61093-34.18452-25.99734-23.04871-6.38641,11.1358-14.00162-6.55013-14.00162-6.55013l-23.25381,4.42198s-45.89429-27.06042-89.45331,30.82959c-43.55902,57.89003,28.57916,154.01572,28.57916,154.01572h-.00002Z" fill="#2f2e41"/>
                      <path d="m433.16003,472.95001c-47.19,38.26001-105.57001,59.04999-167.16003,59.04999-56.23999,0-109.81-17.33997-154.62-49.47998.08002-.84003.16003-1.66998.23004-2.5,1.19-13,2.25-25.64001,2.94995-36.12,2.71002-40.69,97.64001-67.81,97.64001-67.81,0,0,.42999.42999,1.29004,1.17999,5.23999,4.59998,26.50995,21.27997,63.81,25.94,33.25995,4.15997,44.20996-15.57001,47.51996-25.02002,1-2.88,1.30005-4.81,1.30005-4.81l97.63995,46.10999c6.37,9.10004,8.86005,28.70001,9.35004,50.73004.01996.90997.03998,1.81.04999,2.72998Z" fill="#6c63ff"/>
                      <path d="m454.09003,77.91003C403.85004,27.66998,337.05005,0,266,0S128.15002,27.66998,77.91003,77.91003C27.67004,128.15002,0,194.95001,0,266c0,64.85004,23.05005,126.16003,65.29004,174.57001,4.02997,4.63,8.23999,9.14001,12.62,13.52002,1.02997,1.02997,2.07001,2.06,3.12,3.06,2.79999,2.70996,5.65002,5.35999,8.54999,7.92999,1.76001,1.57001,3.54004,3.10999,5.34003,4.62,1.40997,1.19,2.82001,2.35999,4.25,3.51001.02997.02997.04999.04999.07996.07001,3.97003,3.19995,8.01001,6.27997,12.13,9.23999,44.81,32.14001,98.37999,49.47998,154.61998,
                      49.47998,61.59003,0,119.97003-20.78998,167.16003-59.04999,3.84998-3.12,7.62-6.35999,11.32001-9.71002,3.26996-2.95996,6.46997-6.01001,9.60999-9.14996.98999-.98999,1.97998-1.98999,2.95001-3,2.70001-2.78003,5.32001-5.61005,7.88-8.48004,43.37-48.71997,67.07996-110.83997,67.07996-176.60999,0-71.04999-27.66998-137.84998-77.90997-188.08997Zm10.17999,362.20997c-2.5,2.84003-5.06,5.64001-7.67999,8.37-4.08002,4.25-8.28998,8.37-12.64001,12.34003-1.64996,1.52002-3.32001,3-5.01001,4.46997-1.91998,1.67004-3.85999,3.31-5.82996,4.92004-15.53003,
                      12.75-32.54004,23.75-50.73004,32.70996-7.19,3.54999-14.56,6.78003-22.09998,9.67004-29.28998,11.23999-61.08002,17.39996-94.28003,17.39996-32.03998,0-62.75995-5.73999-91.19-16.23999-11.66998-4.29999-22.94995-9.40997-33.77997-15.26001-1.59003-.85999-3.16998-1.72998-4.73999-2.62-8.26001-4.67999-16.25-9.78998-23.91998-15.31-.25-.17999-.51001-.37-.76001-.54999-5.46002-3.94-10.77002-8.09003-15.90002-12.45001-1.88-1.59003-3.73999-3.20001-5.57001-4.84998-2.97998-2.65002-5.89996-5.38-8.75-8.18005-5.39996-5.28998-10.56-10.79999-15.48999-16.52997C26.09003,
                      391.77002,2,331.65002,2,266,2,120.42999,120.43005,2,266,2s264,118.42999,264,264c0,66.66003-24.82996,127.62-65.72998,174.12Z" fill="#3f3d56"/>
                    </svg>
                  </i>
                  </a>
                <ul className="dropdown-menu dropdown-menu-end nav-user-dropdown">
                  <div className="nav-user-info text-center">
                    <h5 className="mb-0 text-black nav-user-name">{sessionStorage.getItem("Username")}</h5>
                  </div>
                  <button className="dropdown-item" onClick={() => {window.location.href = `/user/${sessionStorage.getItem("Username")}`}}>
                    <i className='me-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </i>
                    Konto
                  </button>
                  <button className="dropdown-item" type='button' onClick={() => {sessionStorage.clear(); window.location.reload()}}>
                    <i className='me-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-power">
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                        <line x1="12" y1="2" x2="12" y2="12"></line>
                      </svg>
                    </i>
                    Wyloguj
                  </button>
                </ul>
              </div>
            </div>
  }
  else(
    navbar = 
          <div className="text-center me-4">
            <button type="button" data-bs-target="#LoginForm" data-bs-toggle="modal" className="btn btn-light text-dark me-2">Zaloguj się</button>
            <button type="button" data-bs-target="#RegisterForm" data-bs-toggle="modal" className="btn btn-dark">Zarejestruj się</button>
          </div>
  )

  const validationSchema2 = Yup.object().shape({
    User: Yup.string()
  });

  const initialValues2 = {
    User: "",
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg sticky-top pt-2 Dark">
        <div className="Wrapper container-fluid flex-nowrap flex-lg-wrap justify-content-evenly">
          <a className="navbar-brand me-2 me-lg-0" href="/"><img src={require('./media/logo.png')} height="40px" /></a>
          <Formik validationSchema={validationSchema2} onSubmit={(data) => {window.location.href = `/user/${data.User}`}} initialValues={initialValues2}>
            <Form role="search ms-lg-0">
              <Field className="form-control" name='User' type="text" placeholder="Wyszukaj" aria-label="Wyszukaj" />
            </Form>
          </Formik>
          <button className="Toggler navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#col" aria-controls="col" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div className="collapse navbar-collapse" id="col">
          <ul className="navbar-nav me-auto mb-2 mb-sm-0 text-center fw-bold">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link Active" href="/about">O nas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/history">Historia</a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link" href="/contact">Kontakt</a>
            </li>
          </ul>
          {navbar}
        </div>
      </nav>

    <div className="modal fade" id="LoginForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel" />
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body text-center">
            <Formik initialValues={initialValuesLogin} onSubmit={onSubmitLogin} validationSchema={validationSchemaLogin}>
              <Form className="needs-validation log-in">
                <img className="mb-4" src={require('./media/logo.png')} alt="" width={72} height={57} />
                <h1 className="h3 mb-3 fw-normal">Zaloguj się</h1>
                <div className="form-floating">
                  <Field id="Login" name="Login" className="form-control" placeholder="Nazwa użytkownika"/>
                  <label htmlFor="floatingInput">Nazwa użytkownika</label>
                </div>
                    <ErrorMessage name="Login" / >
                <div className="form-floating">
                  <Field id="Password" name="Password" type="password" className="form-control" placeholder="Hasło"/>
                  <label htmlFor="floatingPassword">Hasło</label>
                  <ErrorMessage name="Password" / >
                  <span className = "Error">
                  </span>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Zaloguj się</button>
                <button type="submit" className="mt-4 w-100 btn btn-lg btn-dark" data-bs-target="#RegisterForm" data-bs-toggle="modal">Zarejestruj się</button>
              </Form>
            </Formik>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal fade" id="RegisterForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" />
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body text-center">
            <Formik initialValues={initialValuesRegister} onSubmit={onSubmitRegister} validationSchema={validationSchemaRegister}>
              <Form className="needs-validation register" noValidate>
                <img className="mb-4" src={require('./media/logo.png')} alt="" width={72} height={57} />
                <h1 className="h3 mb-3 fw-normal">Zarejestruj się</h1>
                <div className="form-floating">
                  <Field id="Login" name="Login" className="form-control" placeholder="Nazwa użytkownika" required />
                  <label htmlFor="floatingInput">Nazwa użytkownika</label>
                  <ErrorMessage name="Login" / >
                </div>
                <div className="form-floating">
                  <Field id="Email" name="Email" className="form-control"  placeholder="jan.kowalski@email.com" required />
                  <label htmlFor="floatingInput">E-mail</label>
                  <ErrorMessage name="Email" / >
                </div>
                <div className="form-floating">
                  <Field name="Password" id="Password" type="password" className="form-control" placeholder="Hasło" required />
                  <label htmlFor="floatingPassword">Hasło</label>
                  <ErrorMessage name="Password" / >
                </div>
                <div className="form-floating">
                  <Field name="RepeatPassword" id="RepeatPassword" type="password" className="form-control" placeholder="Powtórz hasło" required />
                  <label htmlFor="floatingPassword">Powtórz hasło</label>
                  <ErrorMessage name="RepeatPassword" / >
                  <span className = "Error"></span>
                </div>
                <div className="checkbox mb-3">
                </div>
                <button className="w-100 btn btn-lg btn-primary Submit" type="submit">Zarejestruj się</button>
                <button type="button" className="mt-4 w-100 btn btn-lg btn-dark" data-bs-target="#LoginForm" data-bs-toggle="modal">Zaloguj się</button>
              </Form>
            </Formik>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button>
          </div>
        </div>
      </div>
    </div>
  <div className="Background bg-image p-5 text-center text-black">
    <h1 className="mb-3 h2 fs-1 fw-bold">O projekcie Magic Page</h1>
    <p className="fs-4 px-5 py-3 mb-2 text-center fw-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum, rhoncus semper magna. Nulla nec magna sit amet sem interdum condimentum.</p>
  </div>
  <div className="Dark">
    <div className="container">
      <div className="row align-items-center">
        <div className="fw-bold text-center text-lg-start col-12 col-lg-7 align-self-lg-center order-first">
          <h2>Stworzona dla Ciebie</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum, rhoncus semper magna. Nulla nec magna sit amet sem interdum condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mi augue, viverra sit amet ultricies</p>
        </div>
        <div className="text-center text-lg-end col-12 col-lg-5 order-lg-last">
          <img className="Photo-big img-fluid" src={require('./media/people.jpg')} />
        </div>
      </div>
    </div>
  </div>
  <div className="Light">
    <div className="container">
      <div className="row align-items-center">
        <div className="text-center text-lg-end col-12 col-lg-5 align-self-end align-self-lg-center order-last order-lg-first">
          <img className="Photo-big img-fluid" src="https://franchisebusiness.com.au/wp-content/uploads/2022/02/bigstock-Human-Resources-Hr-Management-280730491.jpg" />
        </div>
        <div className="fw-bold text-center text-lg-end col-12 col-lg-7">
          <h2>Specjaliści w różnych dziedzinach</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum, rhoncus semper magna. Nulla nec magna sit amet sem interdum condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mi augue, viverra sit amet ultricies</p>
        </div>
      </div>
    </div>
  </div>
  <div className="Dark">
    <div className="container">
      <div className="row align-items-center">
        <div className="fw-bold text-center text-lg-start col-12 col-lg-7 align-self-lg-center">
          <h2>Zaawansowane narzędzia dla każdego</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum, rhoncus semper magna. Nulla nec magna sit amet sem interdum condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mi augue, viverra sit amet ultricies</p>
        </div>
        <div className="text-center text-lg-end col-12 col-lg-5">
          <img className="Photo-big img-fluid" src="https://www.gtalent.jp/blog/wp-content/uploads/2020/07/ai-engineer02_w1000h670.jpg" />
        </div>
      </div>
    </div>
  </div>
  <div className="Light">
    <div className="container">
      <div className="row align-items-center">
        <div className="text-center text-lg-end col-12 col-lg-5 align-self-end align-self-lg-center order-last order-lg-first">
          <img className="Photo-big img-fluid" src="https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/virtual-assistant.jpg" />
        </div>
        <div className="fw-bold text-center text-lg-end col-12 col-lg-7">
          <h2>Twój osobisty asystent</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum, rhoncus semper magna. Nulla nec magna sit amet sem interdum condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mi augue, viverra sit amet ultricies</p>
        </div>
      </div>
    </div>
  </div>
  <footer className="Footer text-center align-items-center py-3 text-white">
    <p className="fw-bold">Magic Page Sp. z o.o. 2022</p>
  </footer>
</div>

  );
}

export default About;