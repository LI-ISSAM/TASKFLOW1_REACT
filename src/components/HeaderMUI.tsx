import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string;
  onLogout?: () => void;
}

export default function HeaderMUI({ title, onMenuClick, userName, onLogout }: HeaderProps) {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1B8C3E' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {userName && <Typography variant="body2">{userName}</Typography>}
          {onLogout && (
            <Button color="inherit" variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={onLogout}>
              Déconnexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}