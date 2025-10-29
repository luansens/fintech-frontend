import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AccountsDetailsPage } from "./accounts/AccountDetailsPage";
import { AccountsPage } from "./accounts/AccountsPage";
import { LoginPage } from "./auth/LoginPage";
import { HomePage } from "./home/HomePage";
import "./index.css";
import { SignupPage } from "./sign-up/SignupPage";
import { UserDetailsPage } from "./users/UserDetailsPage";
import { UsersPage } from "./users/UsersPage";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:id" element={<AccountsDetailsPage />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
