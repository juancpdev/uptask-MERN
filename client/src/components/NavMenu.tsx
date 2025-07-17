import { Fragment, useEffect } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../types";

type NavMenuProps = {
  name: User["name"];
};

export default function NavMenu({name} : NavMenuProps) {
  const location = useLocation();
  let closePopover: (() => void) | null = null;
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    queryClient.removeQueries({ queryKey: ["user"] });
    setTimeout(() => {
      navigate("/auth/login");
    }, 500);
  };

  // Cierra el popover al cambiar de ruta
  useEffect(() => {
    if (closePopover) closePopover();
  }, [location.pathname]);

  return (
    <Popover as="div" className="relative">
      {({ close }) => {
        closePopover = close;

        return (
          <>
            <PopoverButton className="bg-purple-400 p-2 rounded cursor-pointer">
              <Bars3Icon className="w-6 h-6 text-white " />
            </PopoverButton>

            <Transition
              as={Fragment}
              enter="transition duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen md:max-w-min -translate-x-1/2 md:-translate-x-48">
                <div className="w-full md:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                  <p className="text-center">
                    Hola <strong>{name}</strong>
                  </p>
                  <Link
                    to="/profile"
                    className="block p-2 hover:text-purple-950 hover:bg-gray-50"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/"
                    className="block p-2 hover:text-purple-950 hover:bg-gray-50"
                  >
                    Mis Proyectos
                  </Link>
                  <button
                    className="block p-2 hover:text-red-500 text-red-400 w-full text-start cursor-pointer hover:bg-gray-50"
                    type="button"
                    onClick={logout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
}
