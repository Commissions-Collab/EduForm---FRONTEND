import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../stores/useAuthStore";

const SignUp = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const isRegistering = useAuthStore((state) => state.isRegistering);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = {
      LRN: data.LRN,
      first_name: data.first_name,
      middle_name: data.middle_name || "",
      last_name: data.last_name,
      birthday: data.birthday,
      gender: data.gender,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      parents_fullname: data.parents_fullname || "",
      relationship_to_student: data.relationship_to_student || "",
      parents_number: data.parents_number || "",
      parents_email: data.parents_email || "",
      image: null,
    };

    const result = await registerUser(formData);
    if (result.success) {
      navigate("/sign-in");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 max-h-[calc(100vh-80px)] overflow-y-auto">
      <h1 className="text-4xl font-extrabold text-[#3730A3] text-center mb-2">
        AcadFlow
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Your pathway to knowledge.
      </p>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Create Your Account
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("LRN", { required: true })}
          placeholder="Learner Reference Number (LRN)"
          className="form-input"
        />
        <input
          {...register("first_name", { required: true })}
          placeholder="First Name"
          className="form-input"
        />
        <input
          {...register("middle_name")}
          placeholder="Middle Name (Optional)"
          className="form-input"
        />
        <input
          {...register("last_name", { required: true })}
          placeholder="Last Name"
          className="form-input"
        />
        <input
          type="date"
          {...register("birthday", { required: true })}
          className="form-input"
        />

        <select
          {...register("gender", { required: true })}
          className="form-input"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Prefer not to say</option>
        </select>

        <div className="py-3 space-y-3 rounded-lg">
          <h3 className="text-lg font-semibold">Parent/Guardian Info</h3>
          <input
            {...register("parents_fullname")}
            placeholder="Parent/Guardian Full Name (Optional)"
            className="form-input"
          />
          <input
            {...register("relationship_to_student")}
            placeholder="Relationship to Student (Optional)"
            className="form-input"
          />
          <input
            {...register("parents_number")}
            placeholder="Parent/Guardian Contact Number (Optional)"
            className="form-input"
          />
          <input
            {...register("parents_email")}
            placeholder="Parent/Guardian Email (Optional)"
            className="form-input"
          />
        </div>

        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="form-input"
        />
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="form-input"
        />
        <input
          {...register("password_confirmation", { required: true })}
          type="password"
          placeholder="Confirm Password"
          className="form-input"
        />

        <button
          type="submit"
          disabled={isRegistering}
          className={`w-full py-3 px-4 font-bold rounded-lg shadow-md transition-all duration-200 ${
            isRegistering
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#3730A3] hover:bg-[#2C268C] text-white"
          }`}
        >
          {isRegistering ? "Registering..." : "Sign Up"}
        </button>
      </form>

      <div className="flex justify-center mt-5">
        <span className="text-gray-600 text-sm">Already have an account?</span>
        <Link
          to="/sign-in"
          className="ml-1 text-[#3730A3] hover:underline text-sm font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
