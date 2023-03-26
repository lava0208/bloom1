/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

import { loadStripe } from "@stripe/stripe-js";

import styles from "~styles/pages/account/register.module.scss";
import styles1 from "~styles/pages/account/payment.module.scss";

const getStripe = async () => {
    return await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};

const Payment = () => {
    const router = useRouter();

    const goFree = () => {
        router.push("/account/success");
    };

    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUser = async () => {
        if (userService.getId() === null) {
            router.push("/account/login");
        }
    };

    const paymentcheckout = async () => {
        // Initialize Stripe
        const stripe = await getStripe();
        const currentUser = await userService.getCurrentUser(); // Get the current user

        // Call the API to create a new session
        const response = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ customerEmail: currentUser.email }),
        });

        if (response.ok) {
            const data = await response.json();
            const sessionId = data.sessionId;

            // Redirect the user to the checkout
            await stripe.redirectToCheckout({ sessionId });
        } else {
            // Handle any errors that occurred during session creation
            const error = await response.json();
            console.error("Error creating checkout session:", error.message);
        }
    };

    return (
        <div className={styles.screen}>
            <img className={styles.logo} src={"/assets/logo.png"} alt="logo" />
            <h2 className={styles1.paymentTitle}>Choose your experience.</h2>
            <div className={styles1.paymentContainer}>
                <div className={styles1.freeContainer}>
                    <img src={"/assets/payment-core.png"} alt="core" />
                    <h1 className="freeTitle">Free</h1>
                    <h5>forever</h5>
                    <h5 className={styles1.freeText}>Plan with up to 25 Custom Varieties</h5>
                    <div
                        className={styles.nextButtonContainer}
                        onClick={() => goFree()}
                    >
                        <h5 className={styles.textUppercase}>Continue</h5>
                    </div>
                </div>
                <div className={styles1.proContainer}>
                    <div>
                        <img src={"/assets/payment-pro.png"} alt="core" />
                        <h1 className="proTitle">$5</h1>
                        <h4>per month</h4>
                    </div>
                    <div className={styles1.proRightContainer}>
                        <div className={styles1.proContainerTexts}>
                            <h4><span className="yellowText">Unlimited</span> Custom Varieties</h4>
                            <h4><span className="yellowText">Priority</span> Support</h4>
                            <h4><span className="yellowText">Access</span> to Variety Presets</h4>
                            <h4><span className="yellowText">Unlimited</span> Season Plans</h4>
                        </div>
                        <div
                            className={styles1.proButtonContainer}
                            onClick={() => paymentcheckout()}
                        >
                            <h5 className={styles.textUppercase}>go pro</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
