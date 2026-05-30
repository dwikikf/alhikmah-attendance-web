import { describe, it, expect, vi } from 'vitest';
import { render } from '@/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';
import QRScanner from '../QRScanner';

vi.mock('html5-qrcode', () => {
  const Html5QrcodeMock = vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    clear: vi.fn(),
    isScanning: false,
  }));
  
  (Html5QrcodeMock as any).getCameras = vi.fn().mockResolvedValue([{ id: '1', label: 'Back Camera' }]);

  return {
    Html5Qrcode: Html5QrcodeMock,
    Html5QrcodeSupportedFormats: { QR_CODE: 0 },
  };
});

describe('QRScanner', () => {
  it('renders without crashing', async () => {
    const onScanSuccess = vi.fn();
    render(<QRScanner onScanSuccess={onScanSuccess} />);
    
    expect(screen.getByText(/Scanner/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Arahkan QR Code ke dalam kotak/i)).toBeInTheDocument();
    });
  });
});
