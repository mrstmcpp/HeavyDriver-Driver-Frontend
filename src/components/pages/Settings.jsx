import React, { useEffect, useState, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import CarLoader from "../reusables/CarLoader";
import PageMeta from "../common/PageMeta";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [pref, setPref] = useState({ darkMode: true, language: "en", currency: "INR" });
  const [notif, setNotif] = useState({ email: true, sms: false, push: true });
  const [pwdDlg, setPwdDlg] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const toast = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setProfile({
        name: "Priyanshu Ranjan",
        email: "you@example.com",
        phone: "+91 98xxxxxx12",
      });
      setLoading(false);
    }, 400);
  }, []);

  const langOptions = [
    { label: "English", value: "en" },
    { label: "हिन्दी (Hindi)", value: "hi" },
  ];
  const currencyOptions = [
    { label: "INR (₹)", value: "INR" },
    // { label: "USD ($)", value: "USD" },
  ];

  const save = (msg) =>
    toast.current.show({ severity: "success", summary: "Saved", detail: msg, life: 2000 });

  const changePassword = () => {
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      toast.current.show({
        severity: "warn",
        summary: "Required",
        detail: "Fill all fields",
        life: 2000,
      });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast.current.show({
        severity: "error",
        summary: "Mismatch",
        detail: "Passwords do not match",
        life: 2000,
      });
      return;
    }
    setPwdDlg(false);
    save("Password updated");
  };

  if (loading) return <CarLoader message="Loading your settings..." />;

  return (
    <>
      <PageMeta page={"settings"} />
      <Toast ref={toast} />

      <div className=" text-gray-100 px-6 py-10">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-8">Settings</h1>

        <div className="border !border-yellow-400/10 rounded-2xl !shadow-[0_0_20px_rgba(255,255,0,0.1)] p-2 md:p-4">
          <TabView
            className=""
            pt={{
              nav: { className: "!border-b border-yellow-400/20 flex gap-2" },
              navContainer: { className: "mb-6" },
              headerAction: ({ context }) =>
                `px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-t-lg ${
                  context.selected
                    ? "!text-yellow-400 "
                    : "!text-gray-400 !hover:text-yellow-300"
                }`,
            }}
          >
            {/* ░░░ PROFILE TAB ░░░ */}
            <TabPanel header="Profile">
              <div className="bg-[#0d1425]/60 border border-gray-700/50 rounded-2xl p-6 shadow-inner">
                <h2 className="text-xl !text-yellow-400 font-semibold mb-5">
                  Profile Information
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Full Name</label>
                    <InputText
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Email</label>
                    <InputText
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-300">Phone</label>
                    <InputText
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    label="Save Profile"
                    icon="pi pi-check"
                    className="!bg-yellow-400 !border-none !text-black hover:!bg-yellow-500 transition-all duration-300 rounded-lg"
                    onClick={() => save("Profile updated")}
                  />
                  <Button
                    label="Change Password"
                    icon="pi pi-key"
                    className="!bg-black !border !border-yellow-400 !text-yellow-400 hover:!bg-yellow-400/10 transition-all duration-300 rounded-lg"
                    onClick={() => setPwdDlg(true)}
                  />
                </div>
              </div>
            </TabPanel>

            {/* ░░░ SECURITY TAB ░░░ */}
            <TabPanel header="Security">
              <div className="bg-[#0d1425]/60 border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl text-yellow-400 font-semibold mb-5">Security Options</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    label="Change Password"
                    icon="pi pi-key"
                    className="!bg-yellow-400 !border-none !text-black hover:!bg-yellow-500 transition-all duration-300 rounded-lg"
                    onClick={() => setPwdDlg(true)}
                  />
                  <Button
                    label="Logout from all devices"
                    icon="pi pi-sign-out"
                    className="!bg-black !border !border-yellow-400 !text-yellow-400 hover:!bg-yellow-400/10 transition-all duration-300 rounded-lg"
                    onClick={() => save("Logged out everywhere")}
                  />
                </div>
              </div>
            </TabPanel>

            {/* ░░░ PREFERENCES TAB ░░░ */}
            <TabPanel header="Preferences" >
              <div className="bg-[#0d1425]/60 border border-gray-700/50 rounded-2xl p-6 space-y-6">
                <h2 className="text-xl text-yellow-400 font-semibold mb-5">Set Preferences</h2>
                <div className="flex justify-between items-center">

                  <span className="text-gray-300 font-medium">Dark Mode</span>
                  <InputSwitch
                  disabled={true}
                    checked={pref.darkMode}
                    onChange={(e) => setPref({ ...pref, darkMode: e.value })}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Language</label>
                    <Dropdown
                    disabled={true}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-200"
                      value={pref.language}
                      options={langOptions}
                      onChange={(e) => setPref({ ...pref, language: e.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Currency</label>
                    <Dropdown
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-200"
                      value={pref.currency}
                      options={currencyOptions}
                      onChange={(e) => setPref({ ...pref, currency: e.value })}
                    />
                  </div>
                </div>

                <Button
                  label="Save Preferences"
                  icon="pi pi-check"
                  className="!bg-yellow-400 !border-none !text-black hover:!bg-yellow-500 transition-all duration-300 rounded-lg"
                  onClick={() => save("Preferences saved")}
                />
              </div>
            </TabPanel>

            {/* ░░░ NOTIFICATIONS TAB ░░░ */}
            <TabPanel header="Notifications" disabled={true}>
              <div className="bg-[#0d1425]/60 border border-gray-700/50 rounded-2xl p-6 space-y-5">
                {[
                  { label: "Email Alerts", key: "email" },
                  { label: "SMS Alerts", key: "sms" },
                  { label: "Push Notifications", key: "push" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex justify-between items-center py-2 border-b border-gray-700/40"
                  >
                    <span className="text-gray-300">{item.label}</span>
                    <InputSwitch
                      checked={notif[item.key]}
                      onChange={(e) => setNotif({ ...notif, [item.key]: e.value })}
                    />
                  </div>
                ))}

                <Button
                  label="Save Notification Settings"
                  icon="pi pi-check"
                  className="!bg-yellow-400 !border-none !text-black hover:!bg-yellow-500 transition-all duration-300 rounded-lg"
                  onClick={() => save("Notifications updated")}
                />
              </div>
            </TabPanel>

            {/* ░░░ SUPPORT TAB ░░░ */}
            <TabPanel header="Support">
              <div className="!bg-[#0d1425]/60 border border-gray-700/50 rounded-2xl p-6 !space-x-6 !space-y-4">
                <Button label="FAQs" icon="pi pi-question-circle" className="!border-yellow-400 !text-yellow-400 !bg-transparent hover:!bg-yellow-400/10" />
                <Button label="Contact Support" icon="pi pi-envelope" className="!border-yellow-400 !text-yellow-400 !bg-transparent hover:!bg-yellow-400/10" />
                <Button label="Terms & Privacy" icon="pi pi-file" className="!border-yellow-400 !text-yellow-400 !bg-transparent hover:!bg-yellow-400/10" />
              </div>
            </TabPanel>
          </TabView>
        </div>

        {/* Password Dialog */}
        <Dialog
          header="Change Password"
          visible={pwdDlg}
          onHide={() => setPwdDlg(false)}
          className="w-full m-4 md:w-6/12 lg:w-4/12"
          footer={
            <div className="flex justify-end gap-3">
              <Button
                label="Cancel"
                className="!text-gray-300 !bg-transparent hover:!bg-gray-800/40"
                onClick={() => setPwdDlg(false)}
              />
              <Button
                label="Update"
                icon="pi pi-check"
                className="!bg-yellow-400 !border-none !text-black hover:!bg-yellow-500 transition-all duration-300 rounded-lg"
                onClick={changePassword}
              />
            </div>
          }
        >
          <div className="grid gap-4">
            {["current", "next", "confirm"].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm mb-1 text-gray-300 capitalize">
                  {field} Password
                </label>
                <Password
                  className="!w-full rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  toggleMask
                  value={pwd[field]}
                  onChange={(e) => setPwd({ ...pwd, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default Settings;
