{
  description = "A Nix-flake-based Nodejs development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-25.05";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    systems = ["x86_64-linux"];
    forEachSystem = function:
      nixpkgs.lib.genAttrs systems (system:
        function rec {
          inherit system;
          pkgs = import nixpkgs {
            inherit system;
          };
        });
  in {
    devShells = forEachSystem ({pkgs, ...}: {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          openssl
        ];

        nativeBuildInputs = [pkgs.pkg-config];
      };
    });
  };
}
