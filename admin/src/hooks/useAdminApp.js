import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, logout } from "../store/slices/authSlice";
import { fetchMe, loginUser, registerUser } from "../store/thunks/authThunks";
import {
  createOwnerHeroSlide,
  deleteOwnerHeroSlide,
  fetchOwnerHeroSlides,
  updateOwnerHeroSlide,
} from "../store/thunks/heroThunks";
import { fetchProfile, saveProfile } from "../store/thunks/profileThunks";
import {
  createOwnerService,
  deleteOwnerService,
  fetchOwnerServices,
  updateOwnerService,
} from "../store/thunks/serviceThunks";
import {
  deleteManagedUser,
  fetchManagedUsers,
  updateManagedUserApproval,
  updateManagedUserStatus,
} from "../store/thunks/userManagementThunks";
import {
  defaultAbout,
  emptyEducation,
  emptySkill,
  emptyExperience,
  emptyProject,
  emptyService,
  emptyHeroSlide,
  emptySocial,
  defaultContact,
  TAB_LABELS,
  OWNER_ACCESS_TABS,
  getTabGroupsForRole,
  normalizeServiceForm,
  normalizeHeroForm,
} from "../utils/adminConstants";

export const useAdminApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, user } = useSelector((state) => state.auth);
  const {
    profile,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);
  const {
    items: ownerServices,
    status: ownerServicesStatus,
    error: ownerServicesError,
  } = useSelector((state) => state.services);
  const {
    items: ownerHeroSlides,
    status: ownerHeroStatus,
    error: ownerHeroError,
  } = useSelector((state) => state.hero);
  const {
    items: managedUsers,
    status: managedUsersStatus,
    error: managedUsersError,
  } = useSelector((state) => state.userManagement);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile());
    }
  }, [user, dispatch]);

  const isDashboardRoute = location.pathname === "/dashboard";

  useEffect(() => {
    if (user && !isDashboardRoute && location.pathname !== "/signup") {
      navigate("/dashboard", { replace: true });
    } else if (!user && isDashboardRoute) {
      navigate("/login", { replace: true });
    }
  }, [user, isDashboardRoute, navigate, location.pathname]);

  useEffect(() => {
    dispatch(clearError());
  }, [location.pathname, dispatch]);

  const [loginData, setLoginData] = useState({ mobile: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    mobile: "",
    password: "",
  });

  const isLoading = status === "loading";

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(registerUser(signupData));
  };

  const resetSession = () => {
    dispatch(logout());
    setLoginData({ mobile: "", password: "" });
    setSignupData({ fullName: "", mobile: "", password: "" });
    navigate("/login");
  };

  // theme
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sectional state
  const [activeTab, setActiveTab] = useState("about");
  const [about, setAbout] = useState(defaultAbout);
  const [education, setEducation] = useState([emptyEducation()]);
  const [skills, setSkills] = useState([emptySkill()]);
  const [experience, setExperience] = useState([emptyExperience()]);
  const [projects, setProjects] = useState([emptyProject()]);
  const [services, setServices] = useState([emptyService()]);
  const [heroSlides, setHeroSlides] = useState([emptyHeroSlide()]);
  const [socials, setSocials] = useState([emptySocial()]);
  const [contact, setContact] = useState(defaultContact);
  const [isFreelanceOpen, setIsFreelanceOpen] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [toast, setToast] = useState("");
  const [serviceDraftLoaded, setServiceDraftLoaded] = useState(false);
  const [heroDraftLoaded, setHeroDraftLoaded] = useState(false);

  const userRole = String(user?.role || "").toLowerCase();
  const isOwner = userRole === "owner";
  const canManageServices = userRole === "owner" || userRole === "admin";
  const tabGroups = useMemo(() => getTabGroupsForRole(userRole), [userRole]);

  useEffect(() => {
    if (!profile) return;

    setAbout({ ...defaultAbout, ...(profile.about || {}) });
    setEducation(
      profile.education && profile.education.length
        ? profile.education.map((item) => ({ ...emptyEducation(), ...item }))
        : [emptyEducation()],
    );
    setSkills(
      profile.skills && profile.skills.length
        ? profile.skills.map((item) => ({ ...emptySkill(), ...item }))
        : [emptySkill()],
    );
    setExperience(
      profile.experience && profile.experience.length
        ? profile.experience.map((item) => ({ ...emptyExperience(), ...item }))
        : [emptyExperience()],
    );
    setProjects(
      profile.projects && profile.projects.length
        ? profile.projects.map((item) => ({ ...emptyProject(), ...item }))
        : [emptyProject()],
    );
    setSocials(
      profile.socials && profile.socials.length
        ? profile.socials.map((item) => ({ ...emptySocial(), ...item }))
        : [emptySocial()],
    );
    setContact({ ...defaultContact, ...(profile.contact || {}) });
    setIsFreelanceOpen(profile.isFreelanceOpen ?? true);
  }, [profile]);

  useEffect(() => {
    if (!user || !canManageServices) return;
    dispatch(fetchOwnerServices());
  }, [dispatch, user, canManageServices]);

  useEffect(() => {
    if (!user || !canManageServices) return;
    dispatch(fetchOwnerHeroSlides());
  }, [dispatch, user, canManageServices]);

  useEffect(() => {
    if (!isOwner || !user) return;
    dispatch(fetchManagedUsers());
  }, [dispatch, user, isOwner]);

  useEffect(() => {
    if (isOwner) return;
    if (OWNER_ACCESS_TABS.includes(activeTab)) {
      setActiveTab("about");
    }
  }, [isOwner, activeTab]);

  useEffect(() => {
    if (!canManageServices) {
      setServices([emptyService()]);
      setServiceDraftLoaded(false);
      return;
    }

    if (ownerServicesStatus === "loading") return;

    setServices(
      ownerServices && ownerServices.length
        ? ownerServices.map((service) => normalizeServiceForm(service))
        : [emptyService()],
    );
    setServiceDraftLoaded(true);
  }, [ownerServices, ownerServicesStatus, canManageServices]);

  useEffect(() => {
    if (!canManageServices) {
      setHeroSlides([emptyHeroSlide()]);
      setHeroDraftLoaded(false);
      return;
    }

    if (ownerHeroStatus === "loading") return;

    setHeroSlides(
      ownerHeroSlides && ownerHeroSlides.length
        ? ownerHeroSlides.map((slide) => normalizeHeroForm(slide))
        : [emptyHeroSlide()],
    );
    setHeroDraftLoaded(true);
  }, [ownerHeroSlides, ownerHeroStatus, canManageServices]);

  const addItem = (setter, factory) => setter((prev) => [...prev, factory()]);
  const removeItem = (setter, list, index, min = 1) => {
    if (list.length <= min) return;
    setter(list.filter((_, i) => i !== index));
  };

  const handleArrayField = (setter, list, index, key, value) => {
    setter(
      list.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const sectionTitle = useMemo(() => TAB_LABELS[activeTab], [activeTab]);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleProjectImages = async (index, files) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    const asDataUrls = await Promise.all(
      fileList.map((file) => fileToDataUrl(file)),
    );

    setProjects((prev) =>
      prev.map((proj, i) => {
        if (i !== index) return proj;
        const nextGallery = [...(proj.gallery || []), ...asDataUrls].slice(
          0,
          15,
        );
        return {
          ...proj,
          gallery: nextGallery,
          coverImage: proj.coverImage || nextGallery[0] || "",
        };
      }),
    );
  };

  const removeProjectImage = (pIndex, imgIndex) => {
    setProjects((prev) =>
      prev.map((proj, i) => {
        if (i !== pIndex) return proj;
        const nextGallery = (proj.gallery || []).filter(
          (_, gi) => gi !== imgIndex,
        );
        return {
          ...proj,
          gallery: nextGallery,
          coverImage:
            proj.coverImage && nextGallery.includes(proj.coverImage)
              ? proj.coverImage
              : nextGallery[0] || "",
        };
      }),
    );
  };

  const handleServiceCoverUpload = async (index, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setServices((prev) =>
      prev.map((svc, i) => (i === index ? { ...svc, image: dataUrl } : svc)),
    );
  };

  const handleHeroImageUpload = async (index, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setHeroSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? { ...slide, image: dataUrl } : slide,
      ),
    );
  };

  const handleServiceSnapshotsUpload = async (index, files) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    const current = services[index]?.snapshots || [];
    const remainingSlots = Math.max(0, 15 - current.length);
    const selectedFiles = fileList.slice(0, remainingSlots);
    const snapshots = await Promise.all(
      selectedFiles.map((file) => fileToDataUrl(file)),
    );

    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== index) return svc;
        return {
          ...svc,
          snapshots: [...(svc.snapshots || []), ...snapshots].slice(0, 15),
        };
      }),
    );

    if (fileList.length > selectedFiles.length) {
      setToast("Only 15 snapshots allowed per service");
      setTimeout(() => setToast(""), 2200);
    }
  };

  const removeServiceSnapshot = (serviceIndex, snapshotIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        return {
          ...svc,
          snapshots: (svc.snapshots || []).filter(
            (_, idx) => idx !== snapshotIndex,
          ),
        };
      }),
    );
  };

  const addServiceBulletPoint = (serviceIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        return { ...svc, bulletPoints: [...(svc.bulletPoints || []), ""] };
      }),
    );
  };

  const removeServiceBulletPoint = (serviceIndex, bulletIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        const current = svc.bulletPoints || [];
        if (current.length <= 1) {
          return { ...svc, bulletPoints: [""] };
        }
        return {
          ...svc,
          bulletPoints: current.filter((_, idx) => idx !== bulletIndex),
        };
      }),
    );
  };

  const sanitizeServicePayload = (service) => ({
    name: String(service.name || "").trim(),
    image: String(service.image || "").trim(),
    description: String(service.description || "").trim(),
    bulletPoints: (service.bulletPoints || [])
      .map((point) => String(point || "").trim())
      .filter(Boolean),
    snapshots: (service.snapshots || []).slice(0, 15),
    sortOrder: Number.isFinite(Number(service.sortOrder))
      ? Number(service.sortOrder)
      : 0,
    isActive: service.isActive !== false,
  });

  const sanitizeHeroPayload = (slide) => ({
    image: String(slide.image || "").trim(),
    title: String(slide.title || "").trim(),
    description: String(slide.description || "").trim(),
    sortOrder: Number.isFinite(Number(slide.sortOrder))
      ? Number(slide.sortOrder)
      : 0,
    isActive: slide.isActive !== false,
  });

  const handleSaveService = async (service, index) => {
    const payload = sanitizeServicePayload(service);

    if (!payload.name) {
      setToast("Service name is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.description) {
      setToast("Service description is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const tracker = `service-${service._id || index}`;
    setSavingSection(tracker);
    try {
      if (service._id) {
        await dispatch(
          updateOwnerService({ serviceId: service._id, payload }),
        ).unwrap();
        setToast("Service updated");
      } else {
        await dispatch(createOwnerService(payload)).unwrap();
        setToast("Service created");
      }
      setServiceDraftLoaded(false);
      dispatch(fetchOwnerServices());
    } catch (err) {
      setToast(err.message || "Unable to save service");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteService = async (service, index) => {
    if (!service._id) {
      removeItem(setServices, services, index, 1);
      return;
    }

    const tracker = `service-delete-${service._id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteOwnerService(service._id)).unwrap();
      setToast("Service deleted");
      setServiceDraftLoaded(false);
      dispatch(fetchOwnerServices());
    } catch (err) {
      setToast(err.message || "Unable to delete service");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleSaveHeroSlide = async (slide, index) => {
    const payload = sanitizeHeroPayload(slide);

    if (!payload.image) {
      setToast("Hero image is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.title) {
      setToast("Hero title is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.description) {
      setToast("Hero description is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const tracker = `hero-${slide._id || index}`;
    setSavingSection(tracker);
    try {
      if (slide._id) {
        await dispatch(
          updateOwnerHeroSlide({ heroId: slide._id, payload }),
        ).unwrap();
        setToast("Hero slide updated");
      } else {
        await dispatch(createOwnerHeroSlide(payload)).unwrap();
        setToast("Hero slide created");
      }
      setHeroDraftLoaded(false);
      dispatch(fetchOwnerHeroSlides());
    } catch (err) {
      setToast(err.message || "Unable to save hero slide");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteHeroSlide = async (slide, index) => {
    if (!slide._id) {
      removeItem(setHeroSlides, heroSlides, index, 1);
      return;
    }

    const tracker = `hero-delete-${slide._id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteOwnerHeroSlide(slide._id)).unwrap();
      setToast("Hero slide deleted");
      setHeroDraftLoaded(false);
      dispatch(fetchOwnerHeroSlides());
    } catch (err) {
      setToast(err.message || "Unable to delete hero slide");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setAbout((prev) => ({ ...prev, avatar: dataUrl }));
    e.target.value = "";
    try {
      setSavingSection("about");
      await dispatch(
        saveProfile({
          about: sanitizeAbout({ ...about, avatar: dataUrl }),
          isFreelanceOpen,
        }),
      ).unwrap();
      setToast("About saved");
    } catch (err) {
      setToast(err.message || "Unable to save photo");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const prepDates = (value) => (value ? new Date(value).toISOString() : null);
  const prepNumber = (value) =>
    value === "" || value === null ? undefined : Number(value);
  const sanitizeAbout = (value = about) => {
    const { availability: _availability, ...rest } = value || {};
    return rest;
  };

  const buildPayload = (section) => {
    switch (section) {
      case "about":
        return { about: sanitizeAbout(), isFreelanceOpen };
      case "education":
        return {
          education: education.map((edu) => ({
            ...edu,
            startYear: prepNumber(edu.startYear),
            endYear: edu.currentlyStudying
              ? undefined
              : prepNumber(edu.endYear),
            highlights: edu.highlights || [],
          })),
        };
      case "skills":
        return {
          skills: skills.map((skill) => ({
            ...skill,
            years: prepNumber(skill.years),
            keywords: skill.keywords || [],
          })),
        };
      case "experience":
        return {
          experience: experience.map((exp) => ({
            ...exp,
            startDate: prepDates(exp.startDate),
            endDate: exp.currentlyWorking ? null : prepDates(exp.endDate),
            achievements: exp.achievements || [],
            tech: exp.tech || [],
          })),
        };
      case "projects":
        return {
          projects: projects.map((proj) => ({
            ...proj,
            startedAt: prepDates(proj.startedAt),
            endedAt: prepDates(proj.endedAt),
            tech: proj.tech || [],
            highlights: proj.highlights || [],
            gallery: (proj.gallery || []).slice(0, 15),
          })),
        };
      case "services":
        return {};
      case "socials":
        return {
          socials: socials.map((soc) => ({
            ...soc,
            followers: prepNumber(soc.followers) || 0,
            impressionsLast30: prepNumber(soc.impressionsLast30) || 0,
            engagementRate: prepNumber(soc.engagementRate) || 0,
          })),
        };
      case "contact":
        return { contact: { ...contact }, isFreelanceOpen };
      default:
        return {};
    }
  };

  const handleSaveSection = async (section) => {
    setSavingSection(section);
    try {
      const payload = buildPayload(section);
      await dispatch(saveProfile(payload)).unwrap();
      setToast(`${TAB_LABELS[section]} saved`);
    } catch (err) {
      setToast(err.message || "Unable to save");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleToggleUserStatus = async (targetUser) => {
    if (!targetUser?.id) return;
    const tracker = `user-status-${targetUser.id}`;
    setSavingSection(tracker);
    try {
      await dispatch(
        updateManagedUserStatus({
          userId: targetUser.id,
          isActive: !(targetUser.isActive !== false),
        }),
      ).unwrap();
      setToast("User status updated");
    } catch (err) {
      setToast(err.message || "Unable to update user status");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!targetUser?.id) return;
    const tracker = `user-delete-${targetUser.id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteManagedUser(targetUser.id)).unwrap();
      setToast("User deleted");
    } catch (err) {
      setToast(err.message || "Unable to delete user");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleUpdateUserApproval = async (targetUser, approvalStatus) => {
    if (!targetUser?.id) return;
    const tracker = `user-approval-${targetUser.id}-${approvalStatus}`;
    setSavingSection(tracker);
    try {
      await dispatch(
        updateManagedUserApproval({
          userId: targetUser.id,
          approvalStatus,
        }),
      ).unwrap();
      setToast(`User ${approvalStatus}`);
    } catch (err) {
      setToast(err.message || "Unable to update user approval");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  return {
    dispatch,
    navigate,
    location,
    user,
    status,
    error,
    profile,
    profileStatus,
    profileError,
    ownerServices,
    ownerServicesStatus,
    ownerServicesError,
    ownerHeroSlides,
    ownerHeroStatus,
    ownerHeroError,
    managedUsers,
    managedUsersStatus,
    managedUsersError,
    isOwner,
    tabGroups,
    loginData,
    setLoginData,
    signupData,
    setSignupData,
    isLoading,
    handleLogin,
    handleSignup,
    resetSession,
    theme,
    setTheme,
    activeTab,
    setActiveTab,
    about,
    setAbout,
    education,
    setEducation,
    skills,
    setSkills,
    experience,
    setExperience,
    projects,
    setProjects,
    services,
    setServices,
    heroSlides,
    setHeroSlides,
    socials,
    setSocials,
    contact,
    setContact,
    isFreelanceOpen,
    setIsFreelanceOpen,
    savingSection,
    toast,
    setToast,
    serviceDraftLoaded,
    heroDraftLoaded,
    canManageServices,
    sectionTitle,
    addItem,
    removeItem,
    handleArrayField,
    handleProjectImages,
    removeProjectImage,
    handleServiceCoverUpload,
    handleHeroImageUpload,
    handleServiceSnapshotsUpload,
    removeServiceSnapshot,
    addServiceBulletPoint,
    removeServiceBulletPoint,
    handleSaveService,
    handleDeleteService,
    handleSaveHeroSlide,
    handleDeleteHeroSlide,
    handleAvatarUpload,
    handleSaveSection,
    handleToggleUserStatus,
    handleDeleteUser,
    handleUpdateUserApproval,
    fetchManagedUsers,
  };
};
