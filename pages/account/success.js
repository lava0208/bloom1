/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

import styles from "~styles/pages/account/success.module.scss";

const Success = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        profile_path: "",
        email_newsletter: false,
        share_custom_varieties: false
    });

    const router = useRouter();

    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    const getUser = async () => {
      if (userService.getId() !== null) {
          const _result = await userService.getById(userService.getId());
          const _user = _result.data;
          setUser(_user);
  
          const { session_id } = router.query;
          if (session_id) {
            const response = await fetch("/api/get-customer-id", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId: session_id }),
            });
        
            if (response.ok) {
              const data = await response.json();
              updateUserWithCustomerId(data.customerId);
            }
          }
      } else {
          router.push("/account/login");
      }
  };
  
    


    const updateUserWithCustomerIdAndSubscriptionId = async (customerId, subscriptionId) => {
      // Update the user object with the customer ID and subscription ID
      user.customerId = customerId;
      user.subscriptionId = subscriptionId;
    
      // Save the updated user object
      await userService.update(userService.getId(), user);
    };
    

    return (
        <div className={styles.screen}>
            <img className={styles.logo} src={"/assets/logo.png"} alt="logo" />
            <h2>You&apos;re good to go!</h2>
            <h3>Let&apos;s make this season the best ever.</h3>

            <div
                className={styles.nextButtonContainer}
                onClick={() => router.push("/")}
            >
                <h5>Plan Season</h5>
            </div>
        </div>
    );
};

export default Success;
