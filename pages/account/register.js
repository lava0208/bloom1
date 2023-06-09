/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";
import withLoading from '../../hocs/withLoading';

import { Spinner } from "reactstrap";

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "firebaseConfig";

import styles from "~styles/pages/account/register.module.scss";

const defaultProfileImage = "/default.png";



const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        profile_path: "",
        share_custom_varieties: false,
        subscriptionId: "",
    });

    const [registrationStarted, setRegistrationStarted] = useState(false);

    const router = useRouter();
    const emailValidation = () => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (regex.test(user.email) === false) {
            swal({
                title: "Register Error!",
                text: "Email is not valid",
                icon: "error",
                className: "custom-swal",
            });
            return false;
        }
        return true;
    }

    const [imageFile, setImageFile] = useState()
    const [downloadURL, setDownloadURL] = useState('')
    const [percent, setPercent] = useState(0);

    const handleSelectedFile = (files) => {
        if (files && files[0].size < 10000000) {
            setImageFile(files[0])
            const _imageFile = files[0]
            if (_imageFile) {
                const name = _imageFile.name
                const storageRef = ref(storage, `image/${name}`)
                const uploadTask = uploadBytesResumable(storageRef, _imageFile)
    
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const _percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setPercent(_percent);
                    },
                    (error) => {
                        swal({
                            title: "Error!",
                            text: error.message,
                            icon: "error",
                            className: "custom-swal",
                        });
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                            user.profile_path = url
                            setDownloadURL(url)
                        })
                    },
                )
            }
        } else {
            swal({
                title: "Error!",
                text: "File size is too large",
                icon: "error",
                className: "custom-swal",
            });
        }
    }

    const registerUser = async (user) => {
    console.log('Registering user:', user);
    const result = await userService.register(user);
    if (result.status === true) {
        swal({
            title: "Registration Successful!",
            text: result.message,
            icon: "success",
            className: "custom-swal",
        });
        await userService.setId(result.data.insertedId);
        router.push("/account/plan")
    } else {
        swal({
            title: "Register Error!",
            text: result.message,
            icon: "error",
            className: "custom-swal",
        });
    }
}


const register = async () => {
    if (user.name !== "" && user.email !== "" && user.password !== "") {
      if (emailValidation()) {
        setUser((prevState) => {
          const updatedUser = { ...prevState, profile_path: downloadURL };
          return updatedUser;
        });
        if (!registrationStarted) {
          setRegistrationStarted(true);
          registerUser(user);
        }
      }
    } else {
      swal({
        title: "Registration Error!",
        text: "Please fill all fields.",
        icon: "error",
        className: "custom-swal",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
        register();
    }
};
  


    return (
        <div className={styles.screen}>
            <img className={styles.logo} src={"/assets/logo.png"} alt="logo" />
            <div className={styles.formContainer}>
                <h2>Setup your account.</h2>

                <div className={styles.formDetailsContainer}>
                    <div className={styles.detailsInputsContainer}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Your Name"
                            onKeyPress={handleKeyPress} // Add this line
                            value={user.name}
                            onChange={(e) => {
                                setUser({
                                    ...user,
                                    name: e.target.value,
                                });
                            }}
                        />
                        <input
  type="text"
  className={styles.input}
  placeholder="Email"
  onKeyPress={handleKeyPress}
  value={user.email}
  onChange={(e) => {
    setUser({
      ...user,
      email: e.target.value.toLowerCase(), // Add toLowerCase() here
    });
  }}
/>
                    </div>
                    <label className={styles.detailsProfilePictureContainer}>
    <input
        type="file"
        accept="image/png, image/gif, image/jpeg"
        hidden
        onChange={(e) => handleSelectedFile(e.target.files)}
    />
    {downloadURL ? (
        <img src={downloadURL} alt="profile" />
    ) : (
        user.profile_path ? (
            <img src={user.profile_path} alt="profile" />
        ) : (
            <img src={defaultProfileImage} alt="default profile" />
        )
    )}
    {
        imageFile && percent < 100 && (
            <Spinner color="info"> Loading... </Spinner>
        )
    }
</label>

                </div>

                <input
                    type="password"
                    className={styles.input}
                    placeholder="Password"
                    onKeyPress={handleKeyPress} // Add this line
                    value={user.password}
                    onChange={(e) => {
                        setUser({
                            ...user,
                            password: e.target.value,
                        });
                    }}
                />
            </div>

            <div
                className={styles.nextButtonContainer}
                onClick={() => register()}
            >
                <h5>Sign Up</h5>
            </div>
<h4><a onClick={() => router.push('/account/login')}>Login instead</a></h4>
        </div>
    );
};

export default withLoading(Register);
