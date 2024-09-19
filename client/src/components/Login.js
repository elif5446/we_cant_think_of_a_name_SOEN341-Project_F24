import Header from "../components/Header"; 
import "../styles/Login.css"

function Login() {
    return <>
    
        <main>
      <section id="login-section">
        <form id="login-form" action="#" method="POST">
          <div class="form-group">
            <label for="studentid">Student ID:</label><br></br>
            <input type="text" id="studentid" name="studentid" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label><br></br>
            <input type="password" id="password" name="password" required />
          </div>
          <div class="form-group">
            <button ahref = '/login'>Login</button>
          </div>
        </form>
      </section>
    </main>
    </>
  }

  export default Login;