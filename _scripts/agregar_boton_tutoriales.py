path = "src/app/panel/layout.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''import { signOut } from "@/auth";
import NavPanel from "./NavPanel";
import ThemeToggle from "./ThemeToggle";
import Notificaciones from "./Notificaciones";'''

new = '''import { signOut } from "@/auth";
import NavPanel from "./NavPanel";
import ThemeToggle from "./ThemeToggle";
import Notificaciones from "./Notificaciones";
import BotonTutoriales from "./BotonTutoriales";'''

assert content.count(old) == 1
content = content.replace(old, new)

old2 = '''        <NavPanel />
      </header>
      {children}
    </div>
  );
}'''

new2 = '''        <NavPanel />
      </header>
      {children}
      <BotonTutoriales />
    </div>
  );
}'''

assert content.count(old2) == 1
content = content.replace(old2, new2)

with open(path, "w") as f:
    f.write(content)

print("OK")
